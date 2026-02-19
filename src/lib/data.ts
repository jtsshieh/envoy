export type Channel = "email" | "whatsapp" | "sms" | "phone";

export type TravelerGender = "male" | "female" | "non_binary" | "prefer_not_to_say";

export interface TravelerDocument {
  id: string;
  type: "passport" | "drivers_license" | "visa" | "other";
  label: string;
  number?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingCountry?: string;
  issuingAuthority?: string;
  scanFileName?: string;
  notes?: string;
}

export interface Traveler {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;     // "YYYY-MM-DD"
  gender?: TravelerGender;
  nationality?: string;
  email?: string;
  phone?: string;
  documents: TravelerDocument[];
  notes?: string;
}

export type MessageRole = "outbound" | "inbound" | "draft";
export type MessageType = "text" | "call_transcript" | "scheduled_call";

export type AttachmentType = "image" | "pdf";

export type ThreadStatus = "active" | "awaiting_response" | "confirmed" | "closed";

export type ItinerarySegmentType = "flight" | "train" | "hotel" | "activity" | "transfer";

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: string;
  tags?: string[];
  // For the mockup we use placeholder image URLs for images, and a flag for PDFs
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  sender: string;
  timestamp: string;
  body: string;
  messageType?: MessageType;
  callTitle?: string;
  callPrompt?: string;
  callScheduledFor?: string;
  unreadCall?: boolean;
  transcriptTurns?: {
    id: string;
    speaker: string;
    role: "agent" | "operator";
    body: string;
  }[];
  isAiDraft?: boolean;
  pinned?: boolean;
  attachments?: Attachment[];
}

export interface Thread {
  id: string;
  operatorName: string;
  contact?: string;
  channel: Channel;
  lastMessagePreview: string;
  lastMessageTime: string;
  unread: boolean;
  unreadCount: number;
  pendingDraft: boolean;
  status: ThreadStatus;
  messages: Message[];
}

export interface ItinerarySegment {
  id: string;
  type: ItinerarySegmentType;
  title: string;
  subtitle: string;
  location: string;
  startDate: string;
  endDate?: string;
  operatorName?: string;
  threadId?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  clientName: string;
  destination: string;
  travelDates: string;
  awaitingResponse: number;
  draftsForReview: number;
  threads: Thread[];
  itinerary: ItinerarySegment[];
  travelers: Traveler[];
  notes?: string;
}

export const trips: Trip[] = [
  {
    id: "peru-bolivia",
    clientName: "Sarah & James Thornton",
    destination: "Peru & Bolivia",
    travelDates: "Mar 8–22, 2025",
    awaitingResponse: 2,
    draftsForReview: 1,
    travelers: [
      {
        id: "thornton-sarah",
        firstName: "Sarah",
        lastName: "Thornton",
        dateOfBirth: "1978-03-12",
        gender: "female",
        nationality: "British",
        email: "sarah.thornton@email.com",
        phone: "+44 7700 900142",
        notes: "Gluten-free dietary requirement. Prefers window seat on flights.",
        documents: [
          {
            id: "thornton-sarah-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB8234571",
            issueDate: "2019-06-14",
            expiryDate: "2029-06-13",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
          {
            id: "thornton-sarah-visa-peru",
            type: "visa",
            label: "Peru Tourist Visa",
            issuingCountry: "Peru",
            notes: "30-day tourist entry; no visa required for UK passport holders.",
          },
        ],
      },
      {
        id: "thornton-james",
        firstName: "James",
        lastName: "Thornton",
        dateOfBirth: "1975-07-04",
        gender: "male",
        nationality: "British",
        email: "james.thornton@email.com",
        phone: "+44 7700 900197",
        documents: [
          {
            id: "thornton-james-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB7108834",
            issueDate: "2020-02-28",
            expiryDate: "2030-02-27",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
          {
            id: "thornton-james-dl",
            type: "drivers_license",
            label: "UK Driver's Licence",
            number: "THORN753041JA9AB",
            issuingCountry: "United Kingdom",
            expiryDate: "2031-07-04",
          },
        ],
      },
    ],
    itinerary: [
      {
        id: "pb-itin-1",
        type: "flight",
        title: "Flight to Lima",
        subtitle: "LHR → LIM · British Airways BA243",
        location: "London Heathrow",
        startDate: "Mar 8, 2025",
        notes: "Business class. Departs 21:30.",
      },
      {
        id: "pb-itin-2",
        type: "hotel",
        title: "Hotel Palacio del Inka",
        subtitle: "Colonial Suite · 2 nights",
        location: "Cusco, Peru",
        startDate: "Mar 8, 2025",
        endDate: "Mar 10, 2025",
        operatorName: "Hotel Palacio del Inka",
        threadId: "hotel-palacio",
      },
      {
        id: "pb-itin-3",
        type: "train",
        title: "Belmond Andean Explorer",
        subtitle: "Cusco → Puno · Deluxe Cabin",
        location: "Poroy Station, Cusco",
        startDate: "Mar 8, 2025",
        endDate: "Mar 9, 2025",
        operatorName: "Belmond Andean Explorer",
        threadId: "belmond-andean",
        notes: "Departs 10:00 AM from Poroy Station.",
      },
      {
        id: "pb-itin-4",
        type: "activity",
        title: "Machu Picchu Day Trip",
        subtitle: "Private guided tour",
        location: "Aguas Calientes, Peru",
        startDate: "Mar 14, 2025",
        operatorName: "Hiram Bingham Train",
        threadId: "hiram-bingham",
      },
      {
        id: "pb-itin-5",
        type: "train",
        title: "Hiram Bingham Train",
        subtitle: "Cusco → Aguas Calientes · Bingham Suite",
        location: "Cusco, Peru",
        startDate: "Mar 14, 2025",
        operatorName: "Hiram Bingham Train",
        threadId: "hiram-bingham",
        notes: "Four-course lunch included.",
      },
      {
        id: "pb-itin-6",
        type: "transfer",
        title: "Transfer to Bolivia",
        subtitle: "Private vehicle Puno → Copacabana",
        location: "Puno, Peru",
        startDate: "Mar 16, 2025",
      },
      {
        id: "pb-itin-7",
        type: "activity",
        title: "Uyuni Salt Flats",
        subtitle: "Private 4WD full-day tour",
        location: "Uyuni, Bolivia",
        startDate: "Mar 18, 2025",
        operatorName: "Uyuni Salt Flats Tours",
        threadId: "uyuni-tours",
        notes: "Gluten-free lunch arranged. Includes Incahuasi Island.",
      },
      {
        id: "pb-itin-8",
        type: "flight",
        title: "Return Flight",
        subtitle: "LPB → LHR via BOG · Avianca / British Airways",
        location: "La Paz, Bolivia",
        startDate: "Mar 22, 2025",
      },
      {
        id: "pb-itin-9",
        type: "flight",
        title: "Airline Date-Change Call",
        subtitle: "Move LPB departure by 24 hours",
        location: "La Paz, Bolivia",
        startDate: "Mar 21, 2025",
        operatorName: "Avianca Flight Support",
        threadId: "avianca-date-change",
      },
    ],
    threads: [
      {
        id: "belmond-andean",
        operatorName: "Belmond Andean Explorer",
        channel: "email",
        lastMessagePreview: "Confirmed: two deluxe cabins on the Mar 8 departure. Departure from Cusco at 10:00 AM.",
        lastMessageTime: "Yesterday, 3:41 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "bae-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 14, 9:12 AM",
            body: "Dear Belmond Andean Explorer Team,\n\nI'd like to reserve two deluxe cabins aboard the Andean Explorer for my clients, Sarah and James Thornton, departing Cusco on March 8th. Please confirm availability and let me know what dining preferences you'll need from us ahead of travel.\n\nThank you,\nJustin Shieh\nEnvoy Travel"
          },
          {
            id: "bae-2",
            role: "inbound",
            sender: "Belmond Reservations",
            timestamp: "Feb 14, 2:15 PM",
            body: "Dear Justin,\n\nThank you for reaching out. We're delighted to confirm availability for two deluxe cabins on the March 8th departure from Cusco. The train departs at 10:00 AM from Poroy Station and arrives in Puno the following evening.\n\nTo complete the reservation, we will need:\n• Full names as per passports\n• Dietary requirements\n• Any accessibility needs\n\nWe look forward to welcoming the Thorntons aboard.\n\nWarmly,\nSofía Herrera\nBelmond Reservations"
          },
          {
            id: "bae-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 10:05 AM",
            body: "Sofía,\n\nThank you for the swift confirmation. Please find the details below:\n\n• Sarah Thornton (DOB: 12 March 1978)\n• James Thornton (DOB: 4 July 1975)\n• Dietary: Sarah is gluten-free; James has no restrictions\n• No accessibility needs\n\nPlease proceed with the reservation and send through the confirmation documentation at your convenience.\n\nBest,\nJustin"
          },
          {
            id: "bae-4",
            role: "inbound",
            sender: "Belmond Reservations",
            timestamp: "Feb 17, 3:41 PM",
            body: "Justin,\n\nConfirmed: two deluxe cabins on the March 8 departure. We have noted Sarah's gluten-free requirement and our culinary team will prepare appropriate meals throughout the journey. Departure from Cusco (Poroy Station) at 10:00 AM.\n\nFormal confirmation documents have been sent to your email on file. Please don't hesitate to reach out with any further requests.\n\nWarmly,\nSofía",
            attachments: [
              {
                id: "bae-att-1",
                name: "Belmond_Booking_Confirmation.pdf",
                type: "pdf",
                size: "284 KB",
              },
              {
                id: "bae-att-2",
                name: "Andean_Explorer_Menu.pdf",
                type: "pdf",
                size: "1.1 MB",
              },
            ]
          }
        ]
      },
      {
        id: "hiram-bingham",
        operatorName: "Hiram Bingham Train",
        channel: "email",
        lastMessagePreview: "We're awaiting your response regarding the private carriage upgrade request.",
        lastMessageTime: "Feb 16, 11:22 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "hb-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 13, 8:55 AM",
            body: "Dear Hiram Bingham Team,\n\nI am writing on behalf of my clients, Sarah and James Thornton, who will be visiting Machu Picchu on March 14th as part of their Peru & Bolivia itinerary. I'd like to arrange two tickets on the Hiram Bingham train from Cusco to Aguas Calientes.\n\nAdditionally, could you advise on the availability of a private carriage or upgraded seating experience for their departure?\n\nKind regards,\nJustin Shieh"
          },
          {
            id: "hb-2",
            role: "inbound",
            sender: "PeruRail Luxury",
            timestamp: "Feb 14, 4:33 PM",
            body: "Dear Justin,\n\nThank you for your enquiry. We have availability for the March 14 departure and would be happy to accommodate the Thorntons. Standard Observation tickets are available, as is our exclusive Bingham Suite for a more elevated experience.\n\nRegarding the private carriage: this is subject to a minimum group booking of 8 passengers. However, we can offer priority boarding and a dedicated steward for Suite passengers.\n\nPlease let us know how you'd like to proceed.\n\nBest regards,\nCarlos Mendoza\nPeruRail Luxury Services"
          },
          {
            id: "hb-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 3:20 PM",
            body: "Carlos,\n\nThank you for clarifying the private carriage policy. Two Bingham Suite tickets would be wonderful — please proceed with a reservation for March 14. Could you also confirm the welcome experience and what lunch service is included? My client, Sarah, requires a gluten-free menu.\n\nBest,\nJustin"
          },
          {
            id: "hb-4",
            role: "inbound",
            sender: "PeruRail Luxury",
            timestamp: "Feb 16, 11:22 AM",
            body: "Justin,\n\nWe have noted the Bingham Suite reservation for two on March 14. Our lunch service includes a four-course menu prepared by our executive chef. We will arrange a gluten-free menu for Sarah and flag this to the onboard team.\n\nWe are also checking on a complimentary Pisco Sour welcome for Suite guests — we're awaiting your response to confirm whether the Thorntons drink spirits before we add this to their profile.\n\nThank you,\nCarlos"
          }
        ]
      },
      {
        id: "uyuni-tours",
        operatorName: "Uyuni Salt Flats Tours",
        channel: "whatsapp",
        lastMessagePreview: "Hola! Yes we have availability for March 18. Private 4WD can be arranged 👍",
        lastMessageTime: "Today, 9:14 AM",
        unread: false,
        unreadCount: 0,
        pendingDraft: true,
        status: "active",
        messages: [
          {
            id: "uyuni-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 2:00 PM",
            body: "Hola! I'm reaching out regarding a private tour of the Uyuni Salt Flats on March 18 for two guests. Can you confirm availability for a private 4WD vehicle? My clients have specific dietary requirements (gluten-free) so I also wanted to check what meal arrangements you typically include on full-day tours."
          },
          {
            id: "uyuni-2",
            role: "inbound",
            sender: "Marco — Uyuni Tours",
            timestamp: "Today, 9:14 AM",
            body: "Hola! Yes we have availability for March 18. Private 4WD can be arranged 👍 For full day tours we include lunch at our island camp — we can do gluten-free no problem, just let us know in advance. What time would your guests like to depart?",
            attachments: [
              {
                id: "uyuni-att-1",
                name: "Salt_Flats_Morning.jpg",
                type: "image",
                size: "2.4 MB",
                previewUrl: "https://images.unsplash.com/photo-1547558902-c0b131b1b30a?w=800&q=80",
              },
              {
                id: "uyuni-att-2",
                name: "Incahuasi_Island.jpg",
                type: "image",
                size: "1.8 MB",
                previewUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80",
              },
            ]
          },
          {
            id: "uyuni-draft",
            role: "draft",
            sender: "AI Draft",
            timestamp: "Today, 9:15 AM",
            isAiDraft: true,
            body: "Hi Marco,\n\nFantastic — thank you for confirming. We'd love to proceed with a private 4WD for March 18.\n\nA few details for the booking:\n• 2 guests: Sarah & James Thornton\n• Preferred departure: 7:30 AM (to make the most of morning light for photography)\n• Dietary: Sarah is gluten-free — please ensure her lunch is prepared accordingly\n\nCould you also confirm whether the tour includes the train cemetery and Incahuasi Island? The Thorntons are keen photographers and those are high on their list.\n\nLooking forward to confirming this.\n\nBest,\nJustin Shieh"
          }
        ]
      },
      {
        id: "hotel-palacio",
        operatorName: "Hotel Palacio del Inka",
        channel: "email",
        lastMessagePreview: "Your reservation for March 8–10 has been confirmed. Upgrade to Colonial Suite applied.",
        lastMessageTime: "Feb 12, 5:50 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "hp-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 10, 11:30 AM",
            body: "Dear Palacio del Inka Reservations,\n\nI would like to book two nights (March 8–10) for Mr. and Mrs. Thornton as part of their Peru itinerary. We are hoping for a superior room with a view of the Qorikancha ruins if available.\n\nPlease let me know rates and availability at your earliest convenience.\n\nKind regards,\nJustin Shieh\nEnvoy Travel"
          },
          {
            id: "hp-2",
            role: "inbound",
            sender: "Palacio del Inka",
            timestamp: "Feb 11, 9:05 AM",
            body: "Dear Mr. Shieh,\n\nThank you for choosing Palacio del Inka. We have availability for March 8–10. Our Superior Qorikancha View room is available, however we would like to offer you our Colonial Suite as a complimentary upgrade — it features a private terrace with unobstructed views of the temple.\n\nShall we proceed with the upgrade?\n\nWarm regards,\nLucía Vargas\nGuest Relations",
            attachments: [
              {
                id: "hp-att-1",
                name: "Colonial_Suite_Terrace.jpg",
                type: "image",
                size: "3.1 MB",
                previewUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
              },
            ]
          },
          {
            id: "hp-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 11, 10:40 AM",
            body: "Lucía,\n\nThe Colonial Suite upgrade is wonderful — the Thorntons will love the terrace. Please proceed.\n\nSarah is gluten-free; please note this with the kitchen for their stay.\n\nBest,\nJustin"
          },
          {
            id: "hp-4",
            role: "inbound",
            sender: "Palacio del Inka",
            timestamp: "Feb 12, 5:50 PM",
            body: "Dear Justin,\n\nYour reservation for March 8–10 has been confirmed. The Colonial Suite upgrade has been applied and we have noted the gluten-free requirement for Ms. Thornton. Our breakfast menu will be adapted accordingly.\n\nWe look forward to welcoming the Thorntons.\n\nWarm regards,\nLucía"
          }
        ]
      },
      {
        id: "avianca-date-change",
        operatorName: "Avianca Flight Support",
        channel: "phone",
        lastMessagePreview: "Call underway: checking fare difference and availability for March 23 departure.",
        lastMessageTime: "Feb 18, 4:05 PM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "av-dc-1",
            role: "inbound",
            sender: "Avianca Support (Call)",
            timestamp: "Feb 18, 4:05 PM",
            messageType: "call_transcript",
            callTitle: "LPB-LHR date-change request",
            body: "Date-change call completed. Expand to review transcript.",
            unreadCall: true,
            transcriptTurns: [
              {
                id: "av-dc-turn-1",
                speaker: "AI Agent",
                role: "agent",
                body: "Requested moving LPB-BOG-LHR from Mar 22 to Mar 23 due to revised ground program timing.",
              },
              {
                id: "av-dc-turn-2",
                speaker: "Avianca Reissue Desk",
                role: "operator",
                body: "Confirmed seats are available in same cabin for Mar 23 on both sectors, subject to fare difference and ticket reissue fee.",
              },
              {
                id: "av-dc-turn-3",
                speaker: "AI Agent",
                role: "agent",
                body: "Asked for total amount due, ticketing time limit, and whether current seat assignments can be retained.",
              },
              {
                id: "av-dc-turn-4",
                speaker: "Avianca Reissue Desk",
                role: "operator",
                body: "Quoted fare difference, shared payment link SLA of 6 hours, and confirmed seat retention after payment posts.",
              },
            ],
            attachments: [
              {
                id: "av-dc-att-1",
                name: "Avianca_Reissued_Tickets_LPB-LHR.pdf",
                type: "pdf",
                size: "412 KB",
              },
              {
                id: "av-dc-att-2",
                name: "Avianca_Change_Confirmation.pdf",
                type: "pdf",
                size: "186 KB",
              },
            ],
          }
        ]
      }
    ]
  },
  {
    id: "tanzania-safari",
    clientName: "Robert & Diana Ashworth",
    destination: "Tanzania Safari & Zanzibar",
    travelDates: "Apr 3–14, 2025",
    awaitingResponse: 2,
    draftsForReview: 1,
    travelers: [
      {
        id: "ashworth-robert",
        firstName: "Robert",
        lastName: "Ashworth",
        dateOfBirth: "1968-11-22",
        gender: "male",
        nationality: "British",
        email: "robert.ashworth@ashworthlegal.co.uk",
        phone: "+44 7911 123456",
        notes: "Business class preference. Requires aisle seat due to back condition.",
        documents: [
          {
            id: "ashworth-robert-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB5501923",
            issueDate: "2018-04-10",
            expiryDate: "2028-04-09",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
          {
            id: "ashworth-robert-visa-tz",
            type: "visa",
            label: "Tanzania e-Visa",
            number: "TZ-EV-2025-08812",
            issueDate: "2025-01-15",
            expiryDate: "2025-07-15",
            issuingCountry: "Tanzania",
            notes: "Single entry, valid 90 days from issue.",
          },
        ],
      },
      {
        id: "ashworth-diana",
        firstName: "Diana",
        lastName: "Ashworth",
        dateOfBirth: "1971-05-08",
        gender: "female",
        nationality: "British",
        email: "diana.ashworth@gmail.com",
        phone: "+44 7911 654321",
        notes: "Vegetarian. Keen wildlife photographer — requests front vehicle position.",
        documents: [
          {
            id: "ashworth-diana-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB6612045",
            issueDate: "2021-09-03",
            expiryDate: "2031-09-02",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
          {
            id: "ashworth-diana-visa-tz",
            type: "visa",
            label: "Tanzania e-Visa",
            number: "TZ-EV-2025-08813",
            issueDate: "2025-01-15",
            expiryDate: "2025-07-15",
            issuingCountry: "Tanzania",
          },
        ],
      },
    ],
    itinerary: [
      {
        id: "tz-itin-1",
        type: "flight",
        title: "Flight to Tanzania",
        subtitle: "LHR → JRO · KLM / Precision Air",
        location: "London Heathrow",
        startDate: "Apr 3, 2025",
        notes: "Business class. Arrival via Kilimanjaro.",
      },
      {
        id: "tz-itin-1b",
        type: "flight",
        title: "Qatar Airways Service Call",
        subtitle: "Business seat assignment + extra baggage",
        location: "Doha / London",
        startDate: "Apr 1, 2025",
        operatorName: "Qatar Airways",
        threadId: "qatar-airways-service",
      },
      {
        id: "tz-itin-2",
        type: "hotel",
        title: "Arusha Coffee Lodge",
        subtitle: "Garden Room · 1 night",
        location: "Arusha, Tanzania",
        startDate: "Apr 3, 2025",
        endDate: "Apr 4, 2025",
        operatorName: "Arusha Coffee Lodge",
        threadId: "arusha-coffee-lodge",
      },
      {
        id: "tz-itin-3",
        type: "transfer",
        title: "Airport Transfer to Arusha",
        subtitle: "JRO / Arusha Airport → Arusha Coffee Lodge",
        location: "Arusha, Tanzania",
        startDate: "Apr 3, 2025",
        operatorName: "Arusha Coffee Lodge",
        threadId: "arusha-coffee-lodge",
      },
      {
        id: "tz-itin-4",
        type: "activity",
        title: "Tarangire Game Drives",
        subtitle: "2 days private safari",
        location: "Tarangire National Park, Tanzania",
        startDate: "Apr 4, 2025",
        endDate: "Apr 5, 2025",
        operatorName: "Tarangire Safari Co.",
        threadId: "tarangire-operator",
      },
      {
        id: "tz-itin-5",
        type: "activity",
        title: "Ngorongoro Crater Safari",
        subtitle: "2 days crater permit and private guide",
        location: "Ngorongoro Conservation Area, Tanzania",
        startDate: "Apr 6, 2025",
        endDate: "Apr 7, 2025",
        operatorName: "Ngorongoro Crater Guides",
        threadId: "ngorongoro-operator",
      },
      {
        id: "tz-itin-6",
        type: "activity",
        title: "Serengeti Safari",
        subtitle: "4 days in central Serengeti",
        location: "Serengeti National Park, Tanzania",
        startDate: "Apr 8, 2025",
        endDate: "Apr 11, 2025",
        operatorName: "Serengeti Explorer Camp",
        threadId: "serengeti-operator",
        notes: "Hot air balloon option requested for Apr 10.",
      },
      {
        id: "tz-itin-7",
        type: "transfer",
        title: "Bush Flights & Ground Transfers",
        subtitle: "Arusha → Serengeti → Zanzibar",
        location: "Northern Circuit, Tanzania",
        startDate: "Apr 8, 2025",
        endDate: "Apr 12, 2025",
        operatorName: "SafariLink Tanzania",
        threadId: "tanzania-transfers",
      },
      {
        id: "tz-itin-8",
        type: "hotel",
        title: "Zanzibar Beach Stay",
        subtitle: "Oceanfront villa · 3 nights",
        location: "Nungwi, Zanzibar",
        startDate: "Apr 12, 2025",
        endDate: "Apr 14, 2025",
        operatorName: "The Residence Zanzibar",
        threadId: "zanzibar-hotel",
      },
    ],
    threads: [
      {
        id: "arusha-coffee-lodge",
        operatorName: "Arusha Coffee Lodge",
        channel: "email",
        lastMessagePreview: "Airport meet-and-greet from Arusha Airport is confirmed for April 3.",
        lastMessageTime: "Feb 17, 4:20 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "acl-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 11:10 AM",
            body: "Dear Arusha Coffee Lodge Team,\n\nPlease confirm one garden room for Robert and Diana Ashworth on April 3. We also need an airport meet-and-greet with transfer from Arusha Airport (ARK) to the lodge.\n\nCould you share the driver details and where guests will be met?\n\nKind regards,\nJustin"
          },
          {
            id: "acl-2",
            role: "inbound",
            sender: "Arusha Coffee Lodge Reservations",
            timestamp: "Feb 17, 4:20 PM",
            body: "Dear Justin,\n\nConfirmed for April 3: one garden room for Mr. and Mrs. Ashworth. Airport meet-and-greet from Arusha Airport is also confirmed. Our host will meet them in arrivals with a name board and transfer them directly to the lodge.\n\nDriver details will be shared 48 hours before arrival.\n\nWarm regards,\nNeema"
          }
        ]
      },
      {
        id: "tarangire-operator",
        operatorName: "Tarangire Safari Co.",
        channel: "whatsapp",
        lastMessagePreview: "Private vehicle and guide secured for Apr 4–5; lunch setup under baobab trees available.",
        lastMessageTime: "Today, 8:05 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: true,
        status: "active",
        messages: [
          {
            id: "tar-1",
            role: "outbound",
            sender: "You",
            timestamp: "Yesterday, 6:45 PM",
            body: "Hi! I need a private 2-day Tarangire program for two guests (Apr 4-5), including an experienced guide and sundowner stop. Is this available?"
          },
          {
            id: "tar-2",
            role: "inbound",
            sender: "Jonas - Tarangire Safari Co.",
            timestamp: "Today, 8:05 AM",
            body: "Morning Justin, yes available 👍 Private Land Cruiser and senior guide secured for Apr 4-5. We can also set up lunch under the baobab trees on day 2 if you want."
          }
        ]
      },
      {
        id: "ngorongoro-operator",
        operatorName: "Ngorongoro Crater Guides",
        channel: "email",
        lastMessagePreview: "Crater descent permit held for April 6; awaiting final passport copies.",
        lastMessageTime: "Feb 18, 9:30 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "ngo-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 10:05 AM",
            body: "Dear Ngorongoro Team,\n\nPlease arrange a private crater descent safari for Robert and Diana Ashworth on April 6, with picnic setup and photographic positioning at first light.\n\nPlease confirm permit availability and guide assignment.\n\nBest,\nJustin"
          },
          {
            id: "ngo-2",
            role: "inbound",
            sender: "Ngorongoro Crater Guides",
            timestamp: "Feb 18, 9:30 AM",
            body: "Dear Justin,\n\nCrater descent permit is currently held for April 6. We can confirm the private guide as soon as we receive final passport copies for both guests.\n\nPlease send these at your earliest convenience.\n\nRegards,\nAsha"
          }
        ]
      },
      {
        id: "serengeti-operator",
        operatorName: "Serengeti Explorer Camp",
        channel: "email",
        lastMessagePreview: "Four nights are confirmed and balloon operator can hold two seats for Apr 10.",
        lastMessageTime: "Feb 17, 1:12 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "sec-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 9:00 AM",
            body: "Dear Serengeti Explorer Camp,\n\nPlease confirm four nights for the Ashworths (Apr 8-11). They would like morning and evening game drives, plus a possible balloon safari on Apr 10.\n\nCould you also confirm bush breakfast and sundowner options?\n\nKind regards,\nJustin"
          },
          {
            id: "sec-2",
            role: "inbound",
            sender: "Serengeti Explorer Camp",
            timestamp: "Feb 17, 1:12 PM",
            body: "Dear Justin,\n\nFour nights are confirmed for Apr 8-11. Daily private drives are included. We have requested two provisional seats with Serengeti Balloon Safaris for Apr 10 and can finalize on your instruction.\n\nBush breakfast and sunset sundowner are both available and noted.\n\nWarm regards,\nMoses"
          }
        ]
      },
      {
        id: "zanzibar-hotel",
        operatorName: "The Residence Zanzibar",
        channel: "email",
        lastMessagePreview: "Three-night beach villa stay and airport transfers are confirmed.",
        lastMessageTime: "Feb 17, 5:10 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "zr-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 12:30 PM",
            body: "Dear The Residence Zanzibar,\n\nPlease confirm a three-night oceanfront villa for the Ashworths (Apr 12-14). We also need airport transfers both ways from Zanzibar Airport (ZNZ) and can share flight details once issued.\n\nMany thanks,\nJustin"
          },
          {
            id: "zr-2",
            role: "inbound",
            sender: "The Residence Zanzibar",
            timestamp: "Feb 17, 5:10 PM",
            body: "Dear Justin,\n\nConfirmed: three-night oceanfront villa Apr 12-14 for Mr. and Mrs. Ashworth. Airport transfers from/to ZNZ are included and scheduled once flight times are shared.\n\nWarm regards,\nReservations Team"
          }
        ]
      },
      {
        id: "tanzania-transfers",
        operatorName: "SafariLink Tanzania",
        channel: "phone",
        lastMessagePreview: "Phone briefing completed on inter-camp flights and all baggage limits.",
        lastMessageTime: "Feb 18, 3:05 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "st-1",
            role: "inbound",
            sender: "SafariLink Ops (Phone)",
            timestamp: "Feb 18, 3:05 PM",
            messageType: "call_transcript",
            body: "Call transcript: SafariLink ops confirmed routing ARK to Serengeti and Serengeti to Zanzibar on Apr 8 and Apr 12. Soft luggage limit is 15 kg per guest. Ground transfers at each airstrip are coordinated with lodge teams. E-ticket issuance expected within 24 hours."
          }
        ]
      },
      {
        id: "qatar-airways-service",
        operatorName: "Qatar Airways",
        channel: "phone",
        lastMessagePreview: "Business class seats assigned on long-haul sectors; extra baggage request logged for ticketing.",
        lastMessageTime: "Feb 18, 5:40 PM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "active",
        messages: [
          {
            id: "qa-1",
            role: "inbound",
            sender: "Qatar Airways Contact Centre (Call)",
            timestamp: "Feb 18, 5:40 PM",
            messageType: "call_transcript",
            callTitle: "Business seat and extra baggage confirmation",
            body: "Airline support call completed. Expand to review transcript.",
            unreadCall: true,
            transcriptTurns: [
              {
                id: "qa-turn-1",
                speaker: "AI Agent",
                role: "agent",
                body: "Requested confirmation of business class seat assignments for both guests on outbound and return long-haul segments.",
              },
              {
                id: "qa-turn-2",
                speaker: "Qatar Airways Agent",
                role: "operator",
                body: "Confirmed business cabin inventory and locked adjacent seats for both travelers. PNR updated with seat numbers.",
              },
              {
                id: "qa-turn-3",
                speaker: "AI Agent",
                role: "agent",
                body: "Asked to add one extra checked bag per passenger and verify total baggage allowance reflected on e-tickets.",
              },
              {
                id: "qa-turn-4",
                speaker: "Qatar Airways Agent",
                role: "operator",
                body: "Added prepaid extra baggage request and issued SSR notes. Final EMD receipt will be emailed after payment settlement.",
              },
            ],
            attachments: [
              {
                id: "qa-att-1",
                name: "Qatar_Business_Seat_Confirmation.pdf",
                type: "pdf",
                size: "268 KB",
              },
              {
                id: "qa-att-2",
                name: "Qatar_Extra_Baggage_EMD_Receipt.pdf",
                type: "pdf",
                size: "233 KB",
              },
            ],
          }
        ]
      }
    ]
  },
  {
    id: "namibia-expedition",
    clientName: "Victoria Chen",
    destination: "Namibia Explorer",
    travelDates: "May 19–30, 2025",
    awaitingResponse: 2,
    draftsForReview: 1,
    travelers: [
      {
        id: "chen-victoria",
        firstName: "Victoria",
        lastName: "Chen",
        dateOfBirth: "1990-08-17",
        gender: "female",
        nationality: "British",
        email: "victoria.chen@vcdesign.co.uk",
        phone: "+44 7800 334455",
        notes: "Solo traveler. Keen photographer. Prefers early morning departures. Vegetarian.",
        documents: [
          {
            id: "chen-victoria-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB9034872",
            issueDate: "2022-03-11",
            expiryDate: "2032-03-10",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
          {
            id: "chen-victoria-dl",
            type: "drivers_license",
            label: "UK Driver's Licence",
            number: "CHENX900817VC9AJ",
            issuingCountry: "United Kingdom",
            expiryDate: "2030-08-17",
            notes: "Full clean licence. May need international driving permit for Namibia.",
          },
          {
            id: "chen-victoria-visa-na",
            type: "visa",
            label: "Namibia Tourist Visa",
            issuingCountry: "Namibia",
            notes: "Visa on arrival for UK passport holders. 90 days.",
          },
        ],
      },
    ],
    itinerary: [
      {
        id: "na-itin-1",
        type: "flight",
        title: "Flight to Namibia",
        subtitle: "LHR → WDH via JNB",
        location: "London Heathrow",
        startDate: "May 19, 2025",
      },
      {
        id: "na-itin-1b",
        type: "flight",
        title: "Emirates Service Call",
        subtitle: "Meal, seat, and Dubai lounge reservations",
        location: "Emirates Service Desk",
        startDate: "May 18, 2025",
        operatorName: "Emirates Service Centre",
        threadId: "emirates-service-call",
      },
      {
        id: "na-itin-2",
        type: "hotel",
        title: "Arrival in Windhoek",
        subtitle: "1 night city stay",
        location: "Windhoek, Namibia",
        startDate: "May 19, 2025",
        endDate: "May 20, 2025",
        operatorName: "The Weinberg Windhoek",
        threadId: "weinberg-transfer",
      },
      {
        id: "na-itin-3",
        type: "activity",
        title: "Walvis Bay & Sandwich Harbour",
        subtitle: "4x4 coastal dune excursion",
        location: "Walvis Bay, Namibia",
        startDate: "May 21, 2025",
        operatorName: "Sandwich Harbour 4x4 Tours",
        threadId: "sandwich-harbour",
      },
      {
        id: "na-itin-4",
        type: "hotel",
        title: "Swakopmund Stay",
        subtitle: "2 nights",
        location: "Swakopmund, Namibia",
        startDate: "May 21, 2025",
        endDate: "May 22, 2025",
        operatorName: "Strand Hotel Swakopmund",
        threadId: "swakopmund-lodge",
      },
      {
        id: "na-itin-5",
        type: "activity",
        title: "Namib Desert Program",
        subtitle: "Sossusvlei sunrise and desert drive",
        location: "Namib Desert, Namibia",
        startDate: "May 23, 2025",
        endDate: "May 25, 2025",
        operatorName: "Namib Dune Lodge",
        threadId: "desert-lodge-tours",
      },
      {
        id: "na-itin-6",
        type: "activity",
        title: "Skeleton Coast Excursion",
        subtitle: "Full-day guided coast expedition",
        location: "Skeleton Coast, Namibia",
        startDate: "May 26, 2025",
        operatorName: "Skeleton Coast Scenic Flights",
        threadId: "skeleton-coast-operator",
      },
      {
        id: "na-itin-7",
        type: "activity",
        title: "Damaraland Wilderness Stay",
        subtitle: "2 nights and desert-adapted elephant tracking",
        location: "Damaraland, Namibia",
        startDate: "May 27, 2025",
        endDate: "May 28, 2025",
        operatorName: "Damaraland Camp",
        threadId: "damaraland-camp",
      },
      {
        id: "na-itin-8",
        type: "transfer",
        title: "Cross-country Transfers",
        subtitle: "Windhoek ↔ Coast ↔ Desert ↔ Damaraland",
        location: "Namibia",
        startDate: "May 20, 2025",
        endDate: "May 29, 2025",
        operatorName: "Desert Winds Transfers",
        threadId: "namibia-transfers",
      },
      {
        id: "na-itin-9",
        type: "hotel",
        title: "Final Night in Windhoek",
        subtitle: "1 night before departure",
        location: "Windhoek, Namibia",
        startDate: "May 29, 2025",
        endDate: "May 30, 2025",
      },
      {
        id: "na-itin-10",
        type: "flight",
        title: "Return Flight",
        subtitle: "WDH → LHR via JNB",
        location: "Windhoek, Namibia",
        startDate: "May 30, 2025",
      },
    ],
    threads: [
      {
        id: "weinberg-transfer",
        operatorName: "The Weinberg Windhoek",
        channel: "email",
        lastMessagePreview: "Airport pickup at Hosea Kutako and late check-in are both confirmed.",
        lastMessageTime: "Feb 18, 11:40 AM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "ww-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 9:15 AM",
            body: "Dear The Weinberg Team,\n\nPlease confirm one room for Victoria Chen on May 19 with late check-in. Kindly arrange airport transfer from Hosea Kutako International Airport to the hotel.\n\nThank you,\nJustin"
          },
          {
            id: "ww-2",
            role: "inbound",
            sender: "The Weinberg Windhoek",
            timestamp: "Feb 18, 11:40 AM",
            body: "Dear Justin,\n\nConfirmed for May 19: one room for Ms. Chen. Airport pickup from Hosea Kutako is arranged and our driver will meet her at arrivals.\n\nWarm regards,\nReservations"
          }
        ]
      },
      {
        id: "sandwich-harbour",
        operatorName: "Sandwich Harbour 4x4 Tours",
        channel: "whatsapp",
        lastMessagePreview: "Morning tide slot available on May 21 with bilingual guide and picnic stop.",
        lastMessageTime: "Today, 9:02 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: true,
        status: "active",
        messages: [
          {
            id: "sh-1",
            role: "outbound",
            sender: "You",
            timestamp: "Today, 8:11 AM",
            body: "Hi, do you have a private Sandwich Harbour tour from Walvis Bay for one guest on May 21? She prefers photography-focused stops."
          },
          {
            id: "sh-2",
            role: "inbound",
            sender: "Mara - Sandwich Harbour 4x4",
            timestamp: "Today, 9:02 AM",
            body: "Hi Justin, yes we can do private on May 21. Best slot is morning tide. Includes dunes, lagoon viewpoints and picnic stop. We can assign a bilingual photo-friendly guide."
          }
        ]
      },
      {
        id: "desert-lodge-tours",
        operatorName: "Namib Dune Lodge",
        channel: "email",
        lastMessagePreview: "Desert program confirmed, including Sossusvlei sunrise and Sesriem Canyon drive.",
        lastMessageTime: "Feb 18, 2:05 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "ndl-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 2:20 PM",
            body: "Dear Namib Dune Lodge,\n\nPlease confirm Ms. Victoria Chen for a 3-day desert stay (May 23-25). We would like the lodge to arrange desert excursions including Sossusvlei sunrise and a guided evening stargazing drive.\n\nBest,\nJustin"
          },
          {
            id: "ndl-2",
            role: "inbound",
            sender: "Namib Dune Lodge",
            timestamp: "Feb 18, 2:05 PM",
            body: "Dear Justin,\n\nConfirmed for May 23-25. We have scheduled Sossusvlei sunrise access, Sesriem Canyon drive, and evening stargazing from our dune deck.\n\nRegards,\nAnika"
          }
        ]
      },
      {
        id: "skeleton-coast-operator",
        operatorName: "Skeleton Coast Scenic Flights",
        channel: "email",
        lastMessagePreview: "Skeleton Coast day excursion is available, awaiting passenger passport details.",
        lastMessageTime: "Feb 18, 8:45 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "sc-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 3:55 PM",
            body: "Dear Skeleton Coast Team,\n\nPlease advise availability for a guided Skeleton Coast excursion on May 26 for one guest, departing from the Swakopmund area.\n\nCould you include shipwreck viewpoints and seal colony stop options?\n\nKind regards,\nJustin"
          },
          {
            id: "sc-2",
            role: "inbound",
            sender: "Skeleton Coast Scenic Flights",
            timestamp: "Feb 18, 8:45 AM",
            body: "Dear Justin,\n\nMay 26 is available. We can include shipwreck viewpoints, Cape Cross seals, and lunch at Möwe Bay depending on weather. Kindly send passport details to issue the flight manifest.\n\nBest regards,\nOperations Desk"
          }
        ]
      },
      {
        id: "namibia-transfers",
        operatorName: "Desert Winds Transfers",
        channel: "phone",
        lastMessagePreview: "Route briefing complete: Windhoek, Walvis Bay, Swakopmund, Namib Desert, Damaraland.",
        lastMessageTime: "Feb 18, 6:15 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "dwt-1",
            role: "inbound",
            sender: "Desert Winds Dispatch (Call)",
            timestamp: "Feb 18, 6:15 PM",
            messageType: "call_transcript",
            body: "Call transcript: Dispatch confirmed inter-location transfers for the full route: Windhoek to Walvis Bay, Walvis Bay to Swakopmund, Swakopmund to Namib Desert lodge, Namib to Damaraland, and return to Windhoek. Vehicle will be Toyota Fortuner with English-speaking driver. Long-leg water and fuel stops are included."
          }
        ]
      },
      {
        id: "swakopmund-lodge",
        operatorName: "Strand Hotel Swakopmund",
        channel: "email",
        lastMessagePreview: "Two-night reservation confirmed with harbor-side room preference noted.",
        lastMessageTime: "Feb 17, 6:00 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "sw-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 12:05 PM",
            body: "Dear Strand Hotel Swakopmund,\n\nPlease confirm a two-night stay for Victoria Chen from May 21-22. She prefers a quiet harbor-facing room and early breakfast before tour departures.\n\nThanks,\nJustin"
          },
          {
            id: "sw-2",
            role: "inbound",
            sender: "Strand Hotel Swakopmund",
            timestamp: "Feb 17, 6:00 PM",
            body: "Dear Justin,\n\nReservation confirmed for May 21-22 with harbor-facing room preference noted. Early breakfast from 06:00 has been arranged for tour days.\n\nKind regards,\nFront Office"
          }
        ]
      },
      {
        id: "damaraland-camp",
        operatorName: "Damaraland Camp",
        channel: "email",
        lastMessagePreview: "Elephant tracking guide requested and sundowner drive can be reserved.",
        lastMessageTime: "Feb 18, 12:20 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "active",
        messages: [
          {
            id: "dc-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 4:10 PM",
            body: "Dear Damaraland Camp,\n\nPlease hold two nights (May 27-28) for Ms. Victoria Chen and advise if a specialist guide for desert-adapted elephant tracking is available.\n\nBest,\nJustin"
          },
          {
            id: "dc-2",
            role: "inbound",
            sender: "Damaraland Camp",
            timestamp: "Feb 18, 12:20 PM",
            body: "Dear Justin,\n\nDates are on hold and our elephant specialist guide is available both mornings. We can also add a private sundowner drive on the first evening.\n\nRegards,\nLodge Reservations"
          }
        ]
      },
      {
        id: "emirates-service-call",
        operatorName: "Emirates Service Centre",
        channel: "phone",
        lastMessagePreview: "Meal, seat, and Dubai lounge requests completed with separate confirmations.",
        lastMessageTime: "Feb 18, 9:05 PM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "ek-1",
            role: "inbound",
            sender: "Emirates Service Desk (Call)",
            timestamp: "Feb 18, 9:05 PM",
            messageType: "call_transcript",
            callTitle: "EK service customization for Namibia routing",
            body: "Emirates service call completed. Expand to review transcript.",
            unreadCall: true,
            transcriptTurns: [
              {
                id: "ek-turn-1",
                speaker: "AI Agent",
                role: "agent",
                body: "Requested special meal reservations for both long-haul sectors, including one vegetarian and one gluten-free profile.",
              },
              {
                id: "ek-turn-2",
                speaker: "Emirates Service Agent",
                role: "operator",
                body: "Confirmed meal SSR entries and verified they are linked to both passenger records for outbound and return flights.",
              },
              {
                id: "ek-turn-3",
                speaker: "AI Agent",
                role: "agent",
                body: "Requested preferred seat assignments and Dubai lounge reservations for transit windows in both directions.",
              },
              {
                id: "ek-turn-4",
                speaker: "Emirates Service Agent",
                role: "operator",
                body: "Assigned requested seats where available and issued lounge reservations in DXB with confirmation references.",
              },
            ],
            attachments: [
              {
                id: "ek-att-1",
                name: "Emirates_Meal_Reservation_Receipt.pdf",
                type: "pdf",
                size: "148 KB",
              },
              {
                id: "ek-att-2",
                name: "Emirates_Seat_Reservation_Receipt.pdf",
                type: "pdf",
                size: "201 KB",
              },
              {
                id: "ek-att-3",
                name: "Dubai_Lounge_Reservation_Receipt.pdf",
                type: "pdf",
                size: "176 KB",
              },
            ],
          }
        ]
      }
    ]
  },
  {
    id: "socotra-expedition",
    clientName: "The Harrington Family",
    destination: "Socotra Expedition",
    travelDates: "Oct 6–17, 2025",
    awaitingResponse: 1,
    draftsForReview: 1,
    travelers: [
      {
        id: "harrington-edward",
        firstName: "Edward",
        lastName: "Harrington",
        dateOfBirth: "1972-02-14",
        gender: "male",
        nationality: "British",
        email: "edward.harrington@harringtongroup.com",
        phone: "+44 7732 998877",
        documents: [
          {
            id: "harrington-edward-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB4421088",
            issueDate: "2017-11-20",
            expiryDate: "2027-11-19",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
        ],
      },
      {
        id: "harrington-claire",
        firstName: "Claire",
        lastName: "Harrington",
        dateOfBirth: "1975-09-30",
        gender: "female",
        nationality: "British",
        email: "claire.harrington@gmail.com",
        phone: "+44 7732 112233",
        notes: "No shellfish and prefers calmer boat transfers where possible.",
        documents: [
          {
            id: "harrington-claire-pp",
            type: "passport",
            label: "UK Passport",
            number: "GB7789345",
            issueDate: "2020-05-07",
            expiryDate: "2030-05-06",
            issuingCountry: "United Kingdom",
            issuingAuthority: "HMPO",
          },
        ],
      },
    ],
    itinerary: [
      {
        id: "soq-itin-1",
        type: "flight",
        title: "Arrival to Socotra",
        subtitle: "DXB → SCT · Yemenia charter sector",
        location: "Socotra Airport (SCT)",
        startDate: "Oct 6, 2025",
      },
      {
        id: "soq-itin-2",
        type: "transfer",
        title: "Airport Transfer",
        subtitle: "SCT Airport → Hadibo eco lodge",
        location: "Socotra Island",
        startDate: "Oct 6, 2025",
        operatorName: "Socotra Eco Tours",
        threadId: "socotra-eco",
      },
      {
        id: "soq-itin-3",
        type: "hotel",
        title: "Hadibo Eco Lodge",
        subtitle: "2 deluxe tents · 3 nights",
        location: "Hadibo, Socotra",
        startDate: "Oct 6, 2025",
        endDate: "Oct 9, 2025",
        operatorName: "Hadibo Eco Lodge",
        threadId: "hadibo-lodge",
      },
      {
        id: "soq-itin-4",
        type: "activity",
        title: "Hoq Cave & Diksam Plateau Excursion",
        subtitle: "Private 4x4 day tour",
        location: "Central Socotra",
        startDate: "Oct 8, 2025",
        operatorName: "Socotra Eco Tours",
        threadId: "socotra-eco",
      },
      {
        id: "soq-itin-5",
        type: "hotel",
        title: "Qalansiyah Beach Camp",
        subtitle: "Private beachfront setup · 4 nights",
        location: "Qalansiyah, Socotra",
        startDate: "Oct 9, 2025",
        endDate: "Oct 13, 2025",
        operatorName: "Socotra Eco Tours",
        threadId: "socotra-eco",
      },
      {
        id: "soq-itin-6",
        type: "activity",
        title: "Detwah Lagoon Boat Day",
        subtitle: "Protected marine reserve visit",
        location: "Detwah Lagoon",
        startDate: "Oct 11, 2025",
        operatorName: "Detwah Marine Guides",
        threadId: "detwah-guides",
      },
      {
        id: "soq-itin-7",
        type: "hotel",
        title: "Firmihin Camp",
        subtitle: "Dragon blood tree plateau camp · 3 nights",
        location: "Firmihin, Socotra",
        startDate: "Oct 13, 2025",
        endDate: "Oct 16, 2025",
        operatorName: "Socotra Eco Tours",
        threadId: "socotra-eco",
      },
      {
        id: "soq-itin-8",
        type: "flight",
        title: "Departure from Socotra",
        subtitle: "SCT → DXB",
        location: "Socotra Airport (SCT)",
        startDate: "Oct 17, 2025",
      },
    ],
    threads: [
      {
        id: "socotra-eco",
        operatorName: "Socotra Eco Tours",
        channel: "whatsapp",
        contact: "+967 77 331 9201",
        lastMessagePreview: "4x4 routing and camp logistics confirmed across west and central sectors.",
        lastMessageTime: "Feb 18, 8:42 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "active",
        messages: [
          {
            id: "soq-eco-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 4:10 PM",
            body: "Hi team, we need a 12-day private Socotra itinerary for 2 adults in October with reliable 4x4 support, mixed eco-lodge and camp nights, and guide coverage the full trip.",
          },
          {
            id: "soq-eco-2",
            role: "inbound",
            sender: "Socotra Eco Tours",
            timestamp: "Feb 16, 4:38 PM",
            body: "Confirmed. We can structure this as Hadibo base, Qalansiyah coast, and Firmihin plateau. We include guide, driver, camping crew, and permits.",
          },
          {
            id: "soq-eco-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 17, 9:22 AM",
            body: "Please lock private transfers from SCT airport and ensure one vehicle is reserved for luggage plus camera equipment throughout all camp moves.",
          },
          {
            id: "soq-eco-4",
            role: "inbound",
            sender: "Socotra Eco Tours",
            timestamp: "Feb 18, 8:42 AM",
            body: "Done. Airport pickup and inter-camp relocations are blocked with one dedicated Land Cruiser. Sending full routing with fuel and satellite phone details.",
          },
        ],
      },
      {
        id: "hadibo-lodge",
        operatorName: "Hadibo Eco Lodge",
        channel: "email",
        contact: "reservations@hadiboecolodge.soq",
        lastMessagePreview: "Two deluxe tents held and airport pickup window accepted.",
        lastMessageTime: "Feb 17, 2:15 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "hadibo-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 11:05 AM",
            body: "Please confirm two deluxe tents for Oct 6–9 and coordinate airport transfer from SCT with a 60-minute flight delay buffer.",
          },
          {
            id: "hadibo-2",
            role: "inbound",
            sender: "Hadibo Eco Lodge",
            timestamp: "Feb 17, 2:15 PM",
            body: "Two deluxe tents are held for your dates. Transfer has been arranged with a flexible pickup window and English-speaking coordinator.",
          },
        ],
      },
      {
        id: "detwah-guides",
        operatorName: "Detwah Marine Guides",
        channel: "phone",
        lastMessagePreview: "Boat safety and tidal timing confirmed for the lagoon day.",
        lastMessageTime: "Feb 18, 6:05 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "detwah-call-1",
            role: "inbound",
            sender: "Detwah Marine Guides (Call)",
            timestamp: "Feb 18, 6:05 PM",
            messageType: "call_transcript",
            callTitle: "Detwah lagoon operations call",
            body: "Call completed. Expand to review transcript.",
            transcriptTurns: [
              {
                id: "detwah-turn-1",
                speaker: "AI Agent",
                role: "agent",
                body: "Requested private boat charter with experienced pilot and life-vest briefing before departure.",
              },
              {
                id: "detwah-turn-2",
                speaker: "Marine Operations Lead",
                role: "operator",
                body: "Confirmed private charter, licensed pilot, and mandatory safety briefing at dock before boarding.",
              },
              {
                id: "detwah-turn-3",
                speaker: "AI Agent",
                role: "agent",
                body: "Asked to align departure with tide window and avoid rough-water section for one traveler.",
              },
              {
                id: "detwah-turn-4",
                speaker: "Marine Operations Lead",
                role: "operator",
                body: "Adjusted departure to optimal tide and rerouted return for calmer conditions with updated ETA.",
              },
            ],
          },
        ],
      },
    ],
  }
];

function previewFromBody(body: string): string {
  return body.length > 88 ? `${body.slice(0, 88)}...` : body;
}

function buildFollowUpMessages(thread: Thread): Message[] {
  const stamp = thread.messages.length + 1;
  if (thread.channel === "whatsapp" || thread.channel === "sms") {
    return [
      {
        id: `${thread.id}-fup-${stamp}`,
        role: "outbound",
        sender: "You",
        timestamp: "Today, 1:10 PM",
        body: "Thanks for confirming. Please share the exact meeting point, guide contact, and final payment method so I can brief the client.",
      },
      {
        id: `${thread.id}-fup-${stamp + 1}`,
        role: "inbound",
        sender: thread.operatorName,
        timestamp: "Today, 1:27 PM",
        body: "Perfect. Sending all details now: meeting point pin, guide WhatsApp, and secure payment link. I'll also share reconfirmation the evening before.",
      },
    ];
  }

  if (thread.channel === "phone") {
    return [
      {
        id: `${thread.id}-fup-${stamp}`,
        role: "inbound",
        sender: "AI Call Assistant",
        timestamp: "Feb 18, 6:40 PM",
        messageType: "call_transcript",
        callTitle: `Follow-up operations call with ${thread.operatorName}`,
        body: "Follow-up call completed. Expand to review transcript.",
        transcriptTurns: [
          {
            id: `${thread.id}-fup-turn-1`,
            speaker: "AI Agent",
            role: "agent",
            body: "Requested written summary with final timings and named operations contact.",
          },
          {
            id: `${thread.id}-fup-turn-2`,
            speaker: `${thread.operatorName} Ops`,
            role: "operator",
            body: "Confirmed summary package and duty manager contact will be sent tonight.",
          },
          {
            id: `${thread.id}-fup-turn-3`,
            speaker: "AI Agent",
            role: "agent",
            body: "Reconfirmed escalation path and day-of-service reconfirmation cadence.",
          },
          {
            id: `${thread.id}-fup-turn-4`,
            speaker: `${thread.operatorName} Ops`,
            role: "operator",
            body: "Committed to day-prior reconfirmation and live dispatch updates during operations.",
          },
        ],
      },
    ];
  }

  return [
    {
      id: `${thread.id}-fup-${stamp}`,
      role: "outbound",
      sender: "You",
      timestamp: "Feb 18, 10:20 AM",
      body: "Thank you. Please also confirm cut-off times for changes, cancellation policy, and your on-ground emergency contact.",
    },
    {
      id: `${thread.id}-fup-${stamp + 1}`,
      role: "inbound",
      sender: thread.operatorName,
      timestamp: "Feb 18, 11:05 AM",
      body: "Confirmed. We've attached those operational terms in your file and assigned a duty contact for 24/7 support during travel dates.",
    },
  ];
}

// Enrich each thread with additional back-and-forth so threads feel operationally complete.
for (const trip of trips) {
  for (const thread of trip.threads) {
    // Pull out any trailing AI drafts so they stay at the very end after follow-ups
    const trailingDrafts = thread.messages.filter((m) => m.isAiDraft);
    if (trailingDrafts.length > 0) {
      thread.messages = thread.messages.filter((m) => !m.isAiDraft);
    }

    const followUps = buildFollowUpMessages(thread);
    thread.messages.push(...followUps);
    const last = followUps[followUps.length - 1];
    thread.lastMessagePreview = previewFromBody(last.body);
    thread.lastMessageTime = last.timestamp;

    // Re-append AI drafts after follow-ups
    if (trailingDrafts.length > 0) {
      thread.messages.push(...trailingDrafts);
    }
  }
}

export function getTripById(id: string): Trip | undefined {
  return trips.find(t => t.id === id);
}

export interface AttachmentWithContext extends Attachment {
  tripId: string;
  threadId: string;
  operatorName: string;
  messageTimestamp: string;
  messageSender: string;
}

function inferAttachmentTags(name: string): string[] {
  const n = name.toLowerCase();
  const tags: string[] = [];
  if (n.includes("ticket")) tags.push("ticket");
  if (n.includes("confirm")) tags.push("confirmation");
  if (n.includes("permit")) tags.push("permit");
  if (n.includes("voucher")) tags.push("voucher");
  if (n.includes("receipt")) tags.push("receipt");
  if (n.includes("invoice")) tags.push("invoice");
  if (n.includes("boarding")) tags.push("boarding");
  if (tags.length === 0) tags.push("document");
  return tags;
}

export function getAttachmentsForTrip(tripId: string): AttachmentWithContext[] {
  const trip = getTripById(tripId);
  if (!trip) return [];
  const results: AttachmentWithContext[] = [];
  for (const thread of trip.threads) {
    for (const message of thread.messages) {
      if (!message.attachments) continue;
      for (const att of message.attachments) {
        results.push({
          ...att,
          tags: att.tags ?? inferAttachmentTags(att.name),
          tripId,
          threadId: thread.id,
          operatorName: thread.operatorName,
          messageTimestamp: message.timestamp,
          messageSender: message.sender,
        });
      }
    }
  }
  return results;
}

export interface InboxItem {
  tripId: string;
  tripDestination: string;
  threadId: string;
  operatorName: string;
  channel: Channel;
  unreadCount: number;
  lastMessageTime: string;
  preview: string;
}

export function getInboxItems(): InboxItem[] {
  const items: InboxItem[] = [];
  for (const trip of trips) {
    for (const thread of trip.threads) {
      if ((thread.unreadCount ?? 0) <= 0) continue;
      items.push({
        tripId: trip.id,
        tripDestination: trip.destination,
        threadId: thread.id,
        operatorName: thread.operatorName,
        channel: thread.channel,
        unreadCount: thread.unreadCount,
        lastMessageTime: thread.lastMessageTime,
        preview: thread.lastMessagePreview,
      });
    }
  }
  return items;
}

