import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { CompensationOffer } from './compensation-offer';

export enum DeliverableType {
  MILESTONE = 'MILESTONE',
  FINAL_DELIVERABLE = 'FINAL_DELIVERABLE',
  REPORT = 'REPORT',
  MEDIA = 'MEDIA',
  DOCUMENTATION = 'DOCUMENTATION',
  APPROVAL = 'APPROVAL',
  CUSTOM = 'CUSTOM',
}

export enum DeliverableStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  NEEDS_REVISION = 'NEEDS_REVISION',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Deliverable {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => CompensationOffer,
    description: 'Compensation offer this deliverable belongs to',
  })
  offer: CompensationOffer;

  @ApiProperty({
    type: String,
    example: 'Event Planning Phase 1',
    description: 'Name of the deliverable',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Complete venue selection and initial guest list',
    description: 'Detailed description of what needs to be delivered',
  })
  description: string;

  @ApiProperty({
    enum: DeliverableType,
    example: DeliverableType.MILESTONE,
  })
  type: DeliverableType;

  @ApiProperty({
    enum: DeliverableStatus,
    example: DeliverableStatus.NOT_STARTED,
  })
  status: DeliverableStatus;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Order of this deliverable in the sequence',
  })
  order: number;

  @ApiProperty({
    type: Date,
    description: 'When deliverable is due',
  })
  dueDate: Date;

  @ApiProperty({
    type: Date,
    description: 'When work started on this deliverable',
  })
  startedAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When deliverable was submitted for review',
  })
  submittedAt?: Date | null;

  @ApiProperty({
    type: Date,
    description: 'When deliverable was completed',
  })
  completedAt?: Date | null;

  @ApiProperty({
    type: () => User,
    description: 'User who submitted the deliverable',
  })
  submittedBy?: User | null;

  @ApiProperty({
    type: () => User,
    description: 'User who approved the deliverable',
  })
  approvedBy?: User | null;

  @ApiProperty({
    type: Number,
    example: 1500.0,
    description: 'Payment amount for this deliverable',
  })
  paymentAmount: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Whether payment has been processed',
  })
  isPaid: boolean;

  @ApiProperty({
    type: Date,
    description: 'When payment was processed',
  })
  paidAt?: Date | null;

  @ApiProperty({
    type: String,
    example: 'stripe_payment_123',
    description: 'Payment reference from payment processor',
  })
  paymentReference?: string | null;

  @ApiProperty({
    type: String,
    example: 'https://example.com/deliverable-file.pdf',
    description: 'URL to deliverable file/document',
  })
  fileUrl?: string | null;

  @ApiProperty({
    type: Array,
    description: 'Array of file URLs for multiple attachments',
    example: ['https://example.com/file1.pdf', 'https://example.com/file2.jpg'],
  })
  attachments?: string[];

  @ApiProperty({
    type: String,
    example: 'Great work! Please revise the color scheme.',
    description: 'Feedback from reviewer',
  })
  reviewNotes?: string | null;

  @ApiProperty({
    type: Number,
    example: 85,
    description: 'Quality score out of 100',
  })
  qualityScore?: number | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether deliverable requires approval',
  })
  requiresApproval: boolean;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'Number of revision rounds completed',
  })
  revisionCount: number;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Maximum allowed revisions',
  })
  maxRevisions: number;

  @ApiProperty({
    type: Object,
    description: 'Acceptance criteria for the deliverable',
  })
  acceptanceCriteria?: Record<string, any>;

  @ApiProperty({
    type: Object,
    description: 'Additional deliverable metadata',
  })
  metadata?: Record<string, any>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
