# Rumor API Testing Guide - Complete User Journey

## Base URL
```
http://localhost:3000/api/v1
```

## Swagger Documentation
```
http://localhost:3000/docs
```

---

## 🎭 Testing Personas

1. **Sarah** - Event Host & Influencer
2. **Mike** - Regular Member 
3. **Emma** - VIP Member
4. **Alex** - New User on Waitlist

---

## 📝 Phase 1: User Registration & Authentication

### 1.1 Register Sarah (Host)
```bash
curl -X POST http://localhost:3000/api/v1/auth/email/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "SecurePass123!",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "phoneNumber": "+13105551234",
    "username": "sarahjohnson",
    "dateOfBirth": "1995-03-15",
    "gender": "female"
  }' | jq
```

### 1.2 Login as Sarah
```bash
# Save token to variable
SARAH_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@example.com", "password": "SecurePass123!"}' | jq -r '.token')

echo "Sarah's Token: $SARAH_TOKEN"
```

### 1.3 Register Mike (Regular Member)
```bash
curl -X POST http://localhost:3000/api/v1/auth/email/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mike@example.com",
    "password": "SecurePass123!",
    "firstName": "Mike",
    "lastName": "Chen",
    "phoneNumber": "+14155552345",
    "username": "mikechen",
    "dateOfBirth": "1992-07-20",
    "gender": "male"
  }' | jq
```

### 1.4 Login as Mike
```bash
MIKE_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{"email": "mike@example.com", "password": "SecurePass123!"}' | jq -r '.token')

echo "Mike's Token: $MIKE_TOKEN"
```

### 1.5 Register Emma (VIP Member)
```bash
curl -X POST http://localhost:3000/api/v1/auth/email/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "emma@example.com",
    "password": "SecurePass123!",
    "firstName": "Emma",
    "lastName": "Williams",
    "phoneNumber": "+12125553456",
    "username": "emmawilliams",
    "dateOfBirth": "1990-11-08",
    "gender": "female"
  }' | jq
```

### 1.6 Login as Emma
```bash
EMMA_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/email/login \
  -H "Content-Type: application/json" \
  -d '{"email": "emma@example.com", "password": "SecurePass123!"}' | jq -r '.token')

echo "Emma's Token: $EMMA_TOKEN"
```

---

## 👤 Phase 2: Profile Creation

### 2.1 Create Sarah's Host Profile
```bash
curl -X POST http://localhost:3000/api/v1/host-profiles \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Event curator and lifestyle influencer. Creating unforgettable experiences in LA.",
    "company": "SJ Events",
    "title": "Founder & Creative Director",
    "website": "https://sarahevents.com",
    "specialties": ["luxury events", "brand activations", "private parties"],
    "tier": "PREMIUM",
    "instagramUsername": "sarahcreates",
    "instagramFollowers": 25000
  }' | jq
```

### 2.2 Create Sarah's Member Profile
```bash
curl -X POST http://localhost:3000/api/v1/member-profiles \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "LA-based event curator. Love bringing people together for unforgettable nights.",
    "interests": ["nightlife", "fashion", "art", "music"],
    "personalityType": "ENTERTAINER",
    "instagramUsername": "sarahcreates",
    "location": "Los Angeles, CA"
  }' | jq
```

### 2.3 Create Mike's Member Profile
```bash
curl -X POST http://localhost:3000/api/v1/member-profiles \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Tech entrepreneur. Always looking for interesting events and networking opportunities.",
    "interests": ["technology", "startups", "networking", "music"],
    "personalityType": "ACHIEVER",
    "instagramUsername": "mikechentech",
    "location": "San Francisco, CA"
  }' | jq
```

### 2.4 Create Emma's Member Profile (VIP)
```bash
curl -X POST http://localhost:3000/api/v1/member-profiles \
  -H "Authorization: Bearer $EMMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Fashion blogger and brand consultant. Always at the best events.",
    "interests": ["fashion", "luxury", "travel", "photography"],
    "personalityType": "INFLUENCER",
    "instagramUsername": "emmastyle",
    "location": "New York, NY",
    "isVIP": true
  }' | jq
```

---

## 🎉 Phase 3: Event Creation

### 3.1 Sarah Creates a Luxury Rooftop Party
```bash
EVENT_ID=$(curl -s -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sunset Rooftop Soirée",
    "description": "An exclusive rooftop gathering with breathtaking city views, craft cocktails, and live DJ sets.",
    "venue": "The Sky Lounge",
    "venueAddress": "8900 Sunset Blvd",
    "city": "West Hollywood",
    "state": "CA",
    "country": "USA",
    "postalCode": "90069",
    "startDate": "2025-02-14T18:00:00Z",
    "endDate": "2025-02-15T02:00:00Z",
    "eventType": "INVITE_ONLY",
    "category": "Luxury",
    "capacity": 150,
    "maxAttendees": 150,
    "allowPlusOnes": true,
    "ageRequirement": "21+",
    "requiresApproval": true,
    "autoApproveMembers": false,
    "dressCode": "COCKTAIL",
    "coverImageUrl": "https://example.com/rooftop-party.jpg",
    "isPaidEvent": true,
    "price": 75.00,
    "vipPrice": 0,
    "earlyBirdPrice": 50.00,
    "earlyBirdDeadline": "2025-02-07T00:00:00Z",
    "registrationDeadline": "2025-02-13T00:00:00Z"
  }' | jq -r '.id')

echo "Event Created with ID: $EVENT_ID"
```

### 3.2 Get Event Details
```bash
curl -X GET "http://localhost:3000/api/v1/events/$EVENT_ID" | jq
```

### 3.3 Sarah Creates Another Event (Public)
```bash
EVENT2_ID=$(curl -s -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Art Gallery Opening Night",
    "description": "Join us for an exclusive preview of emerging artists with wine and live music.",
    "venue": "Modern Art Space",
    "venueAddress": "567 La Brea Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "postalCode": "90036",
    "startDate": "2025-02-20T19:00:00Z",
    "endDate": "2025-02-20T23:00:00Z",
    "eventType": "PUBLIC",
    "category": "Art & Culture",
    "capacity": 200,
    "maxAttendees": 200,
    "allowPlusOnes": true,
    "ageRequirement": "18+",
    "requiresApproval": false,
    "autoApproveMembers": true,
    "dressCode": "SMART_CASUAL",
    "coverImageUrl": "https://example.com/art-gallery.jpg",
    "isPaidEvent": false
  }' | jq -r '.id')

echo "Public Event Created with ID: $EVENT2_ID"
```

---

## 📨 Phase 4: Guest Management & RSVPs

### 4.1 Sarah Invites Mike to Rooftop Party
```bash
MIKE_INVITE_ID=$(curl -s -X POST http://localhost:3000/api/v1/guests \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "'$EVENT_ID'",
    "user": "2",
    "guestType": "REGULAR",
    "hasPlusOne": true,
    "requiresApproval": false,
    "notes": "Mike, would love to have you at our exclusive rooftop party!"
  }' | jq -r '.id')

echo "Invite sent to Mike with ID: $MIKE_INVITE_ID"
```

### 4.2 Sarah Invites Emma as VIP
```bash
EMMA_INVITE_ID=$(curl -s -X POST http://localhost:3000/api/v1/guests \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "'$EVENT_ID'",
    "user": "3",
    "guestType": "VIP",
    "hasPlusOne": true,
    "requiresApproval": false,
    "notes": "Emma, you'\''re on the VIP list! Skip the line and enjoy complimentary drinks."
  }' | jq -r '.id')

echo "VIP Invite sent to Emma with ID: $EMMA_INVITE_ID"
```

### 4.3 Mike RSVPs to Event
```bash
curl -X PATCH "http://localhost:3000/api/v1/guests/$MIKE_INVITE_ID/rsvp" \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED",
    "plusOneName": "Jessica Martinez",
    "plusOneEmail": "jessica@example.com"
  }' | jq
```

### 4.4 Emma RSVPs as Maybe
```bash
curl -X PATCH "http://localhost:3000/api/v1/guests/$EMMA_INVITE_ID/rsvp" \
  -H "Authorization: Bearer $EMMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "MAYBE"
  }' | jq
```

### 4.5 View Guest List for Event
```bash
curl -X GET "http://localhost:3000/api/v1/guests/event/$EVENT_ID" \
  -H "Authorization: Bearer $SARAH_TOKEN" | jq
```

---

## 💬 Phase 5: Messaging

### 5.1 Create Conversation (Mike to Sarah)
```bash
CONVERSATION_ID=$(curl -s -X POST http://localhost:3000/api/v1/messaging/conversations \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "participants": [1, 2],
    "title": "About the Rooftop Party"
  }' | jq -r '.id')

echo "Conversation Created: $CONVERSATION_ID"
```

### 5.2 Mike Sends Message
```bash
curl -X POST http://localhost:3000/api/v1/messaging/messages \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "'$CONVERSATION_ID'",
    "content": "Hey Sarah! Super excited about the rooftop party. What'\''s the parking situation?",
    "type": "TEXT"
  }' | jq
```

### 5.3 Sarah Replies
```bash
curl -X POST http://localhost:3000/api/v1/messaging/messages \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "'$CONVERSATION_ID'",
    "content": "Hi Mike! Valet parking is included. Just pull up to the main entrance. See you there!",
    "type": "TEXT"
  }' | jq
```

---

## 💰 Phase 6: Compensation (for Influencers)

### 6.1 Create Compensation Offer for Emma
```bash
COMP_OFFER_ID=$(curl -s -X POST http://localhost:3000/api/v1/compensation/offers \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "'$EVENT_ID'",
    "influencer": "3",
    "type": "CONTENT_CREATION",
    "amount": 500,
    "currency": "USD",
    "deliverables": [
      "5 Instagram posts during event",
      "10+ Instagram stories",
      "1 Instagram Reel within 48 hours"
    ],
    "deadline": "2025-02-16T00:00:00Z",
    "status": "PENDING"
  }' | jq -r '.id')

echo "Compensation Offer Created: $COMP_OFFER_ID"
```

### 6.2 Emma Accepts Offer
```bash
curl -X PATCH "http://localhost:3000/api/v1/compensation/offers/$COMP_OFFER_ID/accept" \
  -H "Authorization: Bearer $EMMA_TOKEN" | jq
```

---

## 📊 Phase 7: Analytics

### 7.1 Get Event Analytics
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/events/$EVENT_ID" \
  -H "Authorization: Bearer $SARAH_TOKEN" | jq
```

### 7.2 Get Host Analytics
```bash
curl -X GET http://localhost:3000/api/v1/analytics/host/me \
  -H "Authorization: Bearer $SARAH_TOKEN" | jq
```

---

## 🔔 Phase 8: Notifications

### 8.1 Send Event Reminder
```bash
curl -X POST http://localhost:3000/api/v1/notifications/send \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EVENT_REMINDER",
    "recipients": ["mike@example.com", "emma@example.com"],
    "eventId": "'$EVENT_ID'",
    "channel": "EMAIL",
    "subject": "Tomorrow: Sunset Rooftop Soirée",
    "message": "Don'\''t forget about tomorrow'\''s exclusive rooftop party! Doors open at 6 PM."
  }' | jq
```

### 8.2 Get Notification Preferences
```bash
curl -X GET http://localhost:3000/api/v1/notifications/preferences \
  -H "Authorization: Bearer $MIKE_TOKEN" | jq
```

---

## 🎟️ Phase 9: Check-in at Event

### 9.1 Check in Mike at Event
```bash
curl -X POST "http://localhost:3000/api/v1/guests/$MIKE_INVITE_ID/check-in" \
  -H "Authorization: Bearer $SARAH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checkInTime": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }' | jq
```

### 9.2 Check Event Attendance
```bash
curl -X GET "http://localhost:3000/api/v1/events/$EVENT_ID/attendance" \
  -H "Authorization: Bearer $SARAH_TOKEN" | jq
```

---

## 📱 Phase 10: Additional Features

### 10.1 Create Referral Code
```bash
REFERRAL_CODE=$(curl -s -X POST http://localhost:3000/api/v1/referrals/generate \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "MEMBER_REFERRAL",
    "expiresAt": "2025-12-31T23:59:59Z"
  }' | jq -r '.code')

echo "Referral Code: $REFERRAL_CODE"
```

### 10.2 Search Events
```bash
curl -X GET "http://localhost:3000/api/v1/events?city=Los Angeles&eventType=PUBLIC" | jq
```

### 10.3 Get My RSVPs
```bash
curl -X GET http://localhost:3000/api/v1/guests/my-rsvps \
  -H "Authorization: Bearer $MIKE_TOKEN" | jq
```

### 10.4 Update Profile
```bash
curl -X PATCH http://localhost:3000/api/v1/member-profiles/me \
  -H "Authorization: Bearer $MIKE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Tech entrepreneur and event enthusiast. Always looking for the next great experience.",
    "interests": ["technology", "startups", "networking", "music", "art"]
  }' | jq
```

---

## 🧪 Test Data Cleanup

### Delete Test Event (Optional)
```bash
curl -X DELETE "http://localhost:3000/api/v1/events/$EVENT_ID" \
  -H "Authorization: Bearer $SARAH_TOKEN"
```

---

## 📋 Quick Reference

### Common Headers
```bash
-H "Content-Type: application/json"
-H "Authorization: Bearer $TOKEN"
```

### Token Variables
- `$SARAH_TOKEN` - Host/Organizer
- `$MIKE_TOKEN` - Regular Member
- `$EMMA_TOKEN` - VIP Member

### Key IDs to Track
- `$EVENT_ID` - Primary test event
- `$EVENT2_ID` - Secondary public event
- `$MIKE_INVITE_ID` - Mike's invitation
- `$EMMA_INVITE_ID` - Emma's VIP invitation
- `$CONVERSATION_ID` - Message thread
- `$COMP_OFFER_ID` - Compensation offer

---

## 🔍 Debugging Tips

### 1. Check Server Logs
```bash
# In your server terminal, you'll see real-time logs
npm run start:dev
```

### 2. Database Verification
```bash
# Check events
docker exec rumor-app-postgres-1 psql -U root -d rumor_api -c "SELECT id, title, status FROM event;"

# Check users
docker exec rumor-app-postgres-1 psql -U root -d rumor_api -c "SELECT id, email, username FROM \"user\";"

# Check guests
docker exec rumor-app-postgres-1 psql -U root -d rumor_api -c "SELECT id, \"rsvpStatus\", \"guestType\" FROM guest;"
```

### 3. Test Individual Endpoints
Each endpoint can be tested independently once you have the required authentication tokens and IDs.

### 4. Swagger UI
Visit http://localhost:3000/docs to test APIs interactively with a visual interface.

---

## 📝 Notes

1. **Authentication**: Most endpoints require authentication. Always include the Bearer token.
2. **IDs**: User IDs start from 1 and increment. Event and other entity IDs are UUIDs.
3. **Timestamps**: Use ISO 8601 format for all date/time fields.
4. **Status Codes**: 
   - 200/201 = Success
   - 400 = Bad Request
   - 401 = Unauthorized
   - 403 = Forbidden
   - 404 = Not Found
   - 409 = Conflict
   - 422 = Validation Error
5. **Pagination**: Most list endpoints support `?page=1&limit=10` query params

---

## 🚀 Advanced Testing Scenarios

### Scenario 1: Waitlist Management
```bash
# Register new user Alex
# Create profile with waitlist position
# Admin approves from waitlist
# Alex can now RSVP to events
```

### Scenario 2: Event Cancellation
```bash
# Create event
# Multiple users RSVP
# Host cancels event
# Notifications sent to all guests
```

### Scenario 3: Payment Flow
```bash
# Create paid event
# User RSVPs
# Process payment
# Generate ticket with QR code
# Check-in with QR code
```

### Scenario 4: Social Features
```bash
# User posts to event feed
# Other users like/comment
# Share event to social media
# Track social analytics
```

---

This guide covers the complete user journey from registration through event attendance. Test in sequence for best results, as later tests depend on data created in earlier steps.