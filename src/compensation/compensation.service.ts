import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  CompensationOffer,
  OfferStatus,
  OfferType,
  PaymentSchedule,
} from './domain/compensation-offer';
import {
  Deliverable,
  DeliverableStatus,
  DeliverableType,
} from './domain/deliverable';
import {
  Payment,
  PaymentStatus,
  PaymentType,
  PaymentMethod,
} from './domain/payment';

@Injectable()
export class CompensationService {
  // Mock data storage - in real implementation, these would be database repositories
  private offers: Map<string, CompensationOffer> = new Map();
  private deliverables: Map<string, Deliverable> = new Map();
  private payments: Map<string, Payment> = new Map();

  constructor() {
    this.initializeMockData();
  }

  async createOffer(
    createOfferDto: CreateOfferDto,
    offeredByUserId: number,
  ): Promise<CompensationOffer> {
    const offerId = this.generateId();

    // Validate offer data
    this.validateOfferData(createOfferDto);

    const offer: CompensationOffer = {
      id: offerId,
      event: { id: createOfferDto.eventId } as any,
      offeredBy: { id: offeredByUserId } as any,
      offeredTo: { id: createOfferDto.offeredToId } as any,
      type: createOfferDto.type,
      status: OfferStatus.DRAFT,
      title: createOfferDto.title,
      description: createOfferDto.description,
      baseAmount: createOfferDto.baseAmount,
      currency: createOfferDto.currency || 'USD',
      percentage: createOfferDto.percentage || null,
      hourlyRate: createOfferDto.hourlyRate || null,
      estimatedHours: createOfferDto.estimatedHours || null,
      paymentSchedule: createOfferDto.paymentSchedule,
      upfrontAmount: createOfferDto.upfrontAmount || null,
      startDate: new Date(createOfferDto.startDate),
      endDate: new Date(createOfferDto.endDate),
      expiresAt: createOfferDto.expiresAt
        ? new Date(createOfferDto.expiresAt)
        : null,
      sentAt: null,
      viewedAt: null,
      respondedAt: null,
      responseMessage: null,
      paymentMethod: createOfferDto.paymentMethod || null,
      requiresContract: createOfferDto.requiresContract || false,
      contractUrl: null,
      contractSigned: false,
      contractSignedAt: null,
      terms: createOfferDto.terms || {},
      performanceMetrics: createOfferDto.performanceMetrics || {},
      metadata: createOfferDto.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.offers.set(offerId, offer);

    // Create deliverables if provided
    if (createOfferDto.deliverables?.length) {
      for (let i = 0; i < createOfferDto.deliverables.length; i++) {
        const deliverableDto = createOfferDto.deliverables[i];
        await this.createDeliverable(offer, deliverableDto, i + 1);
      }
    }

    return offer;
  }

  async getOffers(
    userId: number,
    role: 'client' | 'host' = 'client',
  ): Promise<CompensationOffer[]> {
    const userOffers: CompensationOffer[] = [];

    for (const [offerId, offer] of this.offers) {
      const isRelevant =
        role === 'client'
          ? offer.offeredBy.id === userId
          : offer.offeredTo.id === userId;

      if (isRelevant) {
        userOffers.push(offer);
      }
    }

    return userOffers.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async getOffer(offerId: string, userId: number): Promise<CompensationOffer> {
    const offer = this.offers.get(offerId);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    // Check if user is involved in this offer
    if (offer.offeredBy.id !== userId && offer.offeredTo.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return offer;
  }

  async sendOffer(offerId: string, userId: number): Promise<CompensationOffer> {
    const offer = await this.getOffer(offerId, userId);

    // Only the person who created the offer can send it
    if (offer.offeredBy.id !== userId) {
      throw new ForbiddenException('Only the offer creator can send the offer');
    }

    if (offer.status !== OfferStatus.DRAFT) {
      throw new BadRequestException('Only draft offers can be sent');
    }

    offer.status = OfferStatus.SENT;
    offer.sentAt = new Date();
    offer.updatedAt = new Date();

    // In real implementation, would send notification to recipient
    // await this.notificationService.sendOfferNotification(offer);

    return offer;
  }

  async respondToOffer(
    offerId: string,
    response: 'accept' | 'decline' | 'negotiate',
    message: string,
    userId: number,
  ): Promise<CompensationOffer> {
    const offer = await this.getOffer(offerId, userId);

    // Only the recipient can respond
    if (offer.offeredTo.id !== userId) {
      throw new ForbiddenException('Only the offer recipient can respond');
    }

    if (
      ![OfferStatus.SENT, OfferStatus.VIEWED, OfferStatus.NEGOTIATING].includes(
        offer.status,
      )
    ) {
      throw new BadRequestException('Cannot respond to this offer');
    }

    offer.respondedAt = new Date();
    offer.responseMessage = message;
    offer.updatedAt = new Date();

    switch (response) {
      case 'accept':
        offer.status = OfferStatus.ACCEPTED;
        // Create initial payment if upfront amount is specified
        if (offer.upfrontAmount && offer.upfrontAmount > 0) {
          await this.createPayment(
            offer,
            PaymentType.OFFER_PAYMENT,
            offer.upfrontAmount,
          );
        }
        break;
      case 'decline':
        offer.status = OfferStatus.DECLINED;
        break;
      case 'negotiate':
        offer.status = OfferStatus.NEGOTIATING;
        break;
    }

    return offer;
  }

  async getDeliverables(
    offerId: string,
    userId: number,
  ): Promise<Deliverable[]> {
    // Verify access to offer
    await this.getOffer(offerId, userId);

    const offerDeliverables: Deliverable[] = [];
    for (const [deliverableId, deliverable] of this.deliverables) {
      if (deliverable.offer.id === offerId) {
        offerDeliverables.push(deliverable);
      }
    }

    return offerDeliverables.sort((a, b) => a.order - b.order);
  }

  async submitDeliverable(
    deliverableId: string,
    fileUrl: string,
    notes: string,
    userId: number,
  ): Promise<Deliverable> {
    const deliverable = this.deliverables.get(deliverableId);
    if (!deliverable) {
      throw new NotFoundException('Deliverable not found');
    }

    // Verify access
    await this.getOffer(deliverable.offer.id, userId);

    // Only the host can submit deliverables
    if (deliverable.offer.offeredTo.id !== userId) {
      throw new ForbiddenException(
        'Only the offer recipient can submit deliverables',
      );
    }

    if (deliverable.status === DeliverableStatus.COMPLETED) {
      throw new BadRequestException('Deliverable is already completed');
    }

    deliverable.status = DeliverableStatus.PENDING_REVIEW;
    deliverable.fileUrl = fileUrl;
    deliverable.submittedAt = new Date();
    deliverable.submittedBy = { id: userId } as any;
    deliverable.reviewNotes = notes;
    deliverable.updatedAt = new Date();

    return deliverable;
  }

  async approveDeliverable(
    deliverableId: string,
    qualityScore: number,
    feedback: string,
    userId: number,
  ): Promise<Deliverable> {
    const deliverable = this.deliverables.get(deliverableId);
    if (!deliverable) {
      throw new NotFoundException('Deliverable not found');
    }

    // Verify access
    await this.getOffer(deliverable.offer.id, userId);

    // Only the client can approve deliverables
    if (deliverable.offer.offeredBy.id !== userId) {
      throw new ForbiddenException(
        'Only the offer creator can approve deliverables',
      );
    }

    if (deliverable.status !== DeliverableStatus.PENDING_REVIEW) {
      throw new BadRequestException('Deliverable is not pending review');
    }

    deliverable.status = DeliverableStatus.APPROVED;
    deliverable.qualityScore = qualityScore;
    deliverable.reviewNotes = feedback;
    deliverable.approvedBy = { id: userId } as any;
    deliverable.completedAt = new Date();
    deliverable.updatedAt = new Date();

    // Process payment for the deliverable
    await this.createPayment(
      deliverable.offer,
      PaymentType.MILESTONE_PAYMENT,
      deliverable.paymentAmount,
      deliverable,
    );

    return deliverable;
  }

  async getPayments(offerId: string, userId: number): Promise<Payment[]> {
    // Verify access to offer
    await this.getOffer(offerId, userId);

    const offerPayments: Payment[] = [];
    for (const [paymentId, payment] of this.payments) {
      if (payment.offer.id === offerId) {
        offerPayments.push(payment);
      }
    }

    return offerPayments.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async processPayment(paymentId: string, userId: number): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify access
    await this.getOffer(payment.offer.id, userId);

    // Only the client can process payments
    if (payment.paidBy.id !== userId) {
      throw new ForbiddenException('Only the payer can process payments');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not pending');
    }

    // Simulate payment processing
    payment.status = PaymentStatus.PROCESSING;
    payment.processedAt = new Date();

    // Simulate successful payment
    setTimeout(() => {
      payment.status = PaymentStatus.COMPLETED;
      payment.completedAt = new Date();
      payment.paymentReference = `stripe_payment_${this.generateId()}`;
      payment.payoutReference = `stripe_transfer_${this.generateId()}`;

      // Mark deliverable as paid if applicable
      if (payment.deliverable) {
        payment.deliverable.isPaid = true;
        payment.deliverable.paidAt = new Date();
        payment.deliverable.paymentReference = payment.paymentReference;
      }
    }, 1000);

    return payment;
  }

  private async createDeliverable(
    offer: CompensationOffer,
    deliverableDto: any,
    order: number,
  ): Promise<Deliverable> {
    const deliverableId = this.generateId();

    const deliverable: Deliverable = {
      id: deliverableId,
      offer,
      name: deliverableDto.name,
      description: deliverableDto.description,
      type: DeliverableType.MILESTONE,
      status: DeliverableStatus.NOT_STARTED,
      order,
      dueDate: new Date(deliverableDto.dueDate),
      startedAt: null,
      submittedAt: null,
      completedAt: null,
      submittedBy: null,
      approvedBy: null,
      paymentAmount: deliverableDto.paymentAmount,
      isPaid: false,
      paidAt: null,
      paymentReference: null,
      fileUrl: null,
      attachments: [],
      reviewNotes: null,
      qualityScore: null,
      requiresApproval: deliverableDto.requiresApproval ?? true,
      revisionCount: 0,
      maxRevisions: 3,
      acceptanceCriteria: deliverableDto.acceptanceCriteria || {},
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.deliverables.set(deliverableId, deliverable);
    return deliverable;
  }

  private async createPayment(
    offer: CompensationOffer,
    type: PaymentType,
    amount: number,
    deliverable?: Deliverable,
  ): Promise<Payment> {
    const paymentId = this.generateId();

    const platformFeeRate = 5; // 5% platform fee
    const platformFee = (amount * platformFeeRate) / 100;
    const processingFee = 30; // $30 processing fee
    const netAmount = amount - platformFee - processingFee;

    const payment: Payment = {
      id: paymentId,
      offer,
      deliverable: deliverable || null,
      paidBy: offer.offeredBy,
      paidTo: offer.offeredTo,
      type,
      status: PaymentStatus.PENDING,
      amount,
      currency: offer.currency,
      platformFee,
      platformFeeRate,
      processingFee,
      netAmount,
      paymentMethod: PaymentMethod.STRIPE,
      paymentReference: null,
      payoutReference: null,
      description:
        type === PaymentType.MILESTONE_PAYMENT
          ? `Payment for ${deliverable?.name}`
          : 'Offer payment',
      initiatedAt: new Date(),
      processedAt: null,
      completedAt: null,
      failedAt: null,
      failureReason: null,
      refundedAt: null,
      refundAmount: null,
      refundReason: null,
      requiresApproval: false,
      approvedBy: null,
      approvedAt: null,
      taxInfo: {},
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.payments.set(paymentId, payment);
    return payment;
  }

  private validateOfferData(dto: CreateOfferDto): void {
    if (
      dto.type === OfferType.HOURLY_RATE &&
      (!dto.hourlyRate || !dto.estimatedHours)
    ) {
      throw new BadRequestException(
        'Hourly rate and estimated hours are required for hourly offers',
      );
    }

    if (dto.type === OfferType.PERCENTAGE && !dto.percentage) {
      throw new BadRequestException(
        'Percentage is required for percentage-based offers',
      );
    }

    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (dto.expiresAt && new Date(dto.expiresAt) <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2);
  }

  private initializeMockData(): void {
    // Add some sample data for demonstration
    const sampleOffer: CompensationOffer = {
      id: 'offer-1',
      event: { id: 'event-1' } as any,
      offeredBy: { id: 1 } as any,
      offeredTo: { id: 2 } as any,
      type: OfferType.FLAT_FEE,
      status: OfferStatus.SENT,
      title: 'Corporate Holiday Party Host',
      description: 'Host our annual holiday party for 150 employees',
      baseAmount: 8000,
      currency: 'USD',
      percentage: null,
      hourlyRate: null,
      estimatedHours: null,
      paymentSchedule: PaymentSchedule.MILESTONE_BASED,
      upfrontAmount: 2000,
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-20'),
      expiresAt: new Date('2024-12-01'),
      sentAt: new Date(),
      viewedAt: null,
      respondedAt: null,
      responseMessage: null,
      paymentMethod: 'Stripe',
      requiresContract: true,
      contractUrl: null,
      contractSigned: false,
      contractSignedAt: null,
      terms: {
        cancellationPolicy: '48 hours notice required',
        dresscode: 'Business formal',
      },
      performanceMetrics: {
        attendeeTarget: 150,
        satisfactionBonus: 1000,
      },
      metadata: {
        priority: 'high',
        category: 'corporate_event',
      },
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
    };

    this.offers.set('offer-1', sampleOffer);
  }
}
