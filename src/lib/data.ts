export type Channel = "email" | "whatsapp" | "phone";

export type MessageRole = "outbound" | "inbound" | "draft";

export type AttachmentType = "image" | "pdf";

export type ThreadStatus = "active" | "awaiting_response" | "confirmed" | "closed";

export type ItinerarySegmentType = "flight" | "train" | "hotel" | "activity" | "transfer";

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  size: string;
  // For the mockup we use placeholder image URLs for images, and a flag for PDFs
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  sender: string;
  timestamp: string;
  body: string;
  isAiDraft?: boolean;
  attachments?: Attachment[];
}

export interface Thread {
  id: string;
  operatorName: string;
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
}

export const trips: Trip[] = [
  {
    id: "peru-bolivia",
    clientName: "Sarah & James Thornton",
    destination: "Peru & Bolivia",
    travelDates: "Mar 8–22, 2025",
    awaitingResponse: 2,
    draftsForReview: 1,
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
            body: "Dear Belmond Andean Explorer Team,\n\nI'd like to reserve two deluxe cabins aboard the Andean Explorer for my clients, Sarah and James Thornton, departing Cusco on March 8th. Please confirm availability and let me know what dining preferences you'll need from us ahead of travel.\n\nThank you,\nEleanor Shaw\nConcierge Travel"
          },
          {
            id: "bae-2",
            role: "inbound",
            sender: "Belmond Reservations",
            timestamp: "Feb 14, 2:15 PM",
            body: "Dear Eleanor,\n\nThank you for reaching out. We're delighted to confirm availability for two deluxe cabins on the March 8th departure from Cusco. The train departs at 10:00 AM from Poroy Station and arrives in Puno the following evening.\n\nTo complete the reservation, we will need:\n• Full names as per passports\n• Dietary requirements\n• Any accessibility needs\n\nWe look forward to welcoming the Thorntons aboard.\n\nWarmly,\nSofía Herrera\nBelmond Reservations"
          },
          {
            id: "bae-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 10:05 AM",
            body: "Sofía,\n\nThank you for the swift confirmation. Please find the details below:\n\n• Sarah Thornton (DOB: 12 March 1978)\n• James Thornton (DOB: 4 July 1975)\n• Dietary: Sarah is gluten-free; James has no restrictions\n• No accessibility needs\n\nPlease proceed with the reservation and send through the confirmation documentation at your convenience.\n\nBest,\nEleanor"
          },
          {
            id: "bae-4",
            role: "inbound",
            sender: "Belmond Reservations",
            timestamp: "Feb 17, 3:41 PM",
            body: "Eleanor,\n\nConfirmed: two deluxe cabins on the March 8 departure. We have noted Sarah's gluten-free requirement and our culinary team will prepare appropriate meals throughout the journey. Departure from Cusco (Poroy Station) at 10:00 AM.\n\nFormal confirmation documents have been sent to your email on file. Please don't hesitate to reach out with any further requests.\n\nWarmly,\nSofía",
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
            body: "Dear Hiram Bingham Team,\n\nI am writing on behalf of my clients, Sarah and James Thornton, who will be visiting Machu Picchu on March 14th as part of their Peru & Bolivia itinerary. I'd like to arrange two tickets on the Hiram Bingham train from Cusco to Aguas Calientes.\n\nAdditionally, could you advise on the availability of a private carriage or upgraded seating experience for their departure?\n\nKind regards,\nEleanor Shaw"
          },
          {
            id: "hb-2",
            role: "inbound",
            sender: "PeruRail Luxury",
            timestamp: "Feb 14, 4:33 PM",
            body: "Dear Eleanor,\n\nThank you for your enquiry. We have availability for the March 14 departure and would be happy to accommodate the Thorntons. Standard Observation tickets are available, as is our exclusive Bingham Suite for a more elevated experience.\n\nRegarding the private carriage: this is subject to a minimum group booking of 8 passengers. However, we can offer priority boarding and a dedicated steward for Suite passengers.\n\nPlease let us know how you'd like to proceed.\n\nBest regards,\nCarlos Mendoza\nPeruRail Luxury Services"
          },
          {
            id: "hb-3",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 3:20 PM",
            body: "Carlos,\n\nThank you for clarifying the private carriage policy. Two Bingham Suite tickets would be wonderful — please proceed with a reservation for March 14. Could you also confirm the welcome experience and what lunch service is included? My client, Sarah, requires a gluten-free menu.\n\nBest,\nEleanor"
          },
          {
            id: "hb-4",
            role: "inbound",
            sender: "PeruRail Luxury",
            timestamp: "Feb 16, 11:22 AM",
            body: "Eleanor,\n\nWe have noted the Bingham Suite reservation for two on March 14. Our lunch service includes a four-course menu prepared by our executive chef. We will arrange a gluten-free menu for Sarah and flag this to the onboard team.\n\nWe are also checking on a complimentary Pisco Sour welcome for Suite guests — we're awaiting your response to confirm whether the Thorntons drink spirits before we add this to their profile.\n\nThank you,\nCarlos"
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
            timestamp: "Just now",
            isAiDraft: true,
            body: "Hi Marco,\n\nFantastic — thank you for confirming. We'd love to proceed with a private 4WD for March 18.\n\nA few details for the booking:\n• 2 guests: Sarah & James Thornton\n• Preferred departure: 7:30 AM (to make the most of morning light for photography)\n• Dietary: Sarah is gluten-free — please ensure her lunch is prepared accordingly\n\nCould you also confirm whether the tour includes the train cemetery and Incahuasi Island? The Thorntons are keen photographers and those are high on their list.\n\nLooking forward to confirming this.\n\nBest,\nEleanor Shaw"
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
            body: "Dear Palacio del Inka Reservations,\n\nI would like to book two nights (March 8–10) for Mr. and Mrs. Thornton as part of their Peru itinerary. We are hoping for a superior room with a view of the Qorikancha ruins if available.\n\nPlease let me know rates and availability at your earliest convenience.\n\nKind regards,\nEleanor Shaw\nConcierge Travel"
          },
          {
            id: "hp-2",
            role: "inbound",
            sender: "Palacio del Inka",
            timestamp: "Feb 11, 9:05 AM",
            body: "Dear Ms. Shaw,\n\nThank you for choosing Palacio del Inka. We have availability for March 8–10. Our Superior Qorikancha View room is available, however we would like to offer you our Colonial Suite as a complimentary upgrade — it features a private terrace with unobstructed views of the temple.\n\nShall we proceed with the upgrade?\n\nWarm regards,\nLucía Vargas\nGuest Relations",
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
            body: "Lucía,\n\nThe Colonial Suite upgrade is wonderful — the Thorntons will love the terrace. Please proceed.\n\nSarah is gluten-free; please note this with the kitchen for their stay.\n\nBest,\nEleanor"
          },
          {
            id: "hp-4",
            role: "inbound",
            sender: "Palacio del Inka",
            timestamp: "Feb 12, 5:50 PM",
            body: "Dear Eleanor,\n\nYour reservation for March 8–10 has been confirmed. The Colonial Suite upgrade has been applied and we have noted the gluten-free requirement for Ms. Thornton. Our breakfast menu will be adapted accordingly.\n\nWe look forward to welcoming the Thorntons.\n\nWarm regards,\nLucía"
          }
        ]
      }
    ]
  },
  {
    id: "safari-kenya",
    clientName: "Robert & Diana Ashworth",
    destination: "Safari Kenya",
    travelDates: "Apr 3–17, 2025",
    awaitingResponse: 3,
    draftsForReview: 0,
    itinerary: [
      {
        id: "sk-itin-1",
        type: "flight",
        title: "Flight to Nairobi",
        subtitle: "LHR → NBO · Kenya Airways KQ101",
        location: "London Heathrow",
        startDate: "Apr 3, 2025",
        notes: "Business class. Departs 22:05.",
      },
      {
        id: "sk-itin-2",
        type: "flight",
        title: "Nairobi to Masai Mara",
        subtitle: "NBO → MRE · AirKenya WL 401",
        location: "Wilson Airport, Nairobi",
        startDate: "Apr 3, 2025",
        operatorName: "AirKenya Express",
        threadId: "nairobi-transfer",
        notes: "Departs 08:00.",
      },
      {
        id: "sk-itin-3",
        type: "hotel",
        title: "Angama Mara Lodge",
        subtitle: "3 nights · Tent Suite",
        location: "Masai Mara, Kenya",
        startDate: "Apr 3, 2025",
        endDate: "Apr 6, 2025",
        operatorName: "Angama Mara Lodge",
        threadId: "angama-mara",
      },
      {
        id: "sk-itin-4",
        type: "activity",
        title: "Out of Africa Experience",
        subtitle: "Sunset dinner on the escarpment",
        location: "Oloololo Escarpment, Masai Mara",
        startDate: "Apr 7, 2025",
        operatorName: "Angama Mara Lodge",
        threadId: "angama-mara",
        notes: "30th anniversary celebration. Champagne & canapés.",
      },
      {
        id: "sk-itin-5",
        type: "transfer",
        title: "Transfer to Ol Pejeta",
        subtitle: "Private charter flight",
        location: "Masai Mara, Kenya",
        startDate: "Apr 10, 2025",
      },
      {
        id: "sk-itin-6",
        type: "activity",
        title: "Rhino Tracking Experience",
        subtitle: "Private permit · Half-day",
        location: "Ol Pejeta Conservancy, Kenya",
        startDate: "Apr 10, 2025",
        operatorName: "Ol Pejeta Conservancy",
        threadId: "ol-pejeta",
        notes: "Permit required 30 days in advance.",
      },
      {
        id: "sk-itin-7",
        type: "flight",
        title: "Return to Nairobi",
        subtitle: "MRE → NBO · AirKenya WL 402",
        location: "Masai Mara, Kenya",
        startDate: "Apr 14, 2025",
        operatorName: "AirKenya Express",
        threadId: "nairobi-transfer",
        notes: "Departs 14:00.",
      },
      {
        id: "sk-itin-8",
        type: "flight",
        title: "Return Flight",
        subtitle: "NBO → LHR · Kenya Airways KQ100",
        location: "Nairobi, Kenya",
        startDate: "Apr 17, 2025",
      },
    ],
    threads: [
      {
        id: "angama-mara",
        operatorName: "Angama Mara Lodge",
        channel: "email",
        lastMessagePreview: "We have confirmed the Out of Africa experience for April 7th at sunset.",
        lastMessageTime: "Feb 15, 2:10 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "am-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 14, 10:00 AM",
            body: "Dear Angama team,\n\nI'm confirming the reservation for Robert and Diana Ashworth, checking in April 3 for three nights. They are celebrating their 30th anniversary — could you arrange something special? Diana has mentioned the 'Out of Africa' experience on the escarpment."
          },
          {
            id: "am-2",
            role: "inbound",
            sender: "Angama Mara",
            timestamp: "Feb 15, 2:10 PM",
            body: "Eleanor, what a wonderful anniversary milestone! We have confirmed the Out of Africa experience for April 7th at sunset — champagne, canapés and a private dinner on the escarpment. Congratulations will be passed along. We'll be in touch with more details shortly.",
            attachments: [
              {
                id: "am-att-1",
                name: "Angama_Mara_Escarpment.jpg",
                type: "image",
                size: "4.2 MB",
                previewUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
              },
              {
                id: "am-att-2",
                name: "Out_of_Africa_Experience.pdf",
                type: "pdf",
                size: "890 KB",
              },
            ]
          }
        ]
      },
      {
        id: "ol-pejeta",
        operatorName: "Ol Pejeta Conservancy",
        channel: "email",
        lastMessagePreview: "Awaiting confirmation on the rhino tracking permit for April 10.",
        lastMessageTime: "Feb 16, 8:30 AM",
        unread: true,
        unreadCount: 1,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "op-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 3:00 PM",
            body: "Hello Ol Pejeta,\n\nI'd like to arrange a private rhino tracking experience for two guests on April 10. Please advise on permit availability and any advance booking requirements."
          },
          {
            id: "op-2",
            role: "inbound",
            sender: "Ol Pejeta Permits",
            timestamp: "Feb 16, 8:30 AM",
            body: "Dear Eleanor, thank you for reaching out. Rhino tracking permits must be arranged 30 days in advance. We currently have one slot available on April 10 — please confirm and we'll begin the paperwork. Awaiting confirmation on the rhino tracking permit for April 10."
          }
        ]
      },
      {
        id: "nairobi-transfer",
        operatorName: "AirKenya Express",
        channel: "phone",
        lastMessagePreview: "Spoke with reservations — flights Nairobi–Masai Mara Apr 3 & return Apr 14 confirmed.",
        lastMessageTime: "Feb 13, 11:15 AM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "ak-1",
            role: "inbound",
            sender: "AirKenya (Phone call)",
            timestamp: "Feb 13, 11:15 AM",
            body: "Call notes: Spoke with reservations. Two seats confirmed on Nairobi–Masai Mara flight April 3 (WL 401, departs 0800). Return Masai Mara–Nairobi April 14 (WL 402, departs 1400). Tickets to be issued within 48 hours."
          }
        ]
      }
    ]
  },
  {
    id: "amalfi-coast",
    clientName: "Victoria Chen",
    destination: "Amalfi Coast",
    travelDates: "May 19–29, 2025",
    awaitingResponse: 1,
    draftsForReview: 1,
    itinerary: [
      {
        id: "ac-itin-1",
        type: "flight",
        title: "Flight to Naples",
        subtitle: "LHR → NAP · easyJet EZY8931",
        location: "London Gatwick",
        startDate: "May 19, 2025",
        notes: "Departs 07:15.",
      },
      {
        id: "ac-itin-2",
        type: "transfer",
        title: "Private Transfer to Ravello",
        subtitle: "Naples Airport → Villa Cimbrone",
        location: "Naples, Italy",
        startDate: "May 19, 2025",
      },
      {
        id: "ac-itin-3",
        type: "hotel",
        title: "Villa Cimbrone",
        subtitle: "Suite Belvedere · 3 nights",
        location: "Ravello, Italy",
        startDate: "May 19, 2025",
        endDate: "May 22, 2025",
        operatorName: "Villa Cimbrone",
        threadId: "villa-cimbrone",
        notes: "Welcome flowers arranged.",
      },
      {
        id: "ac-itin-4",
        type: "activity",
        title: "Private Boat to Capri",
        subtitle: "Half-day charter · Gozzo Sorrentino",
        location: "Positano, Italy",
        startDate: "May 21, 2025",
        operatorName: "Positano Boat Charters",
        threadId: "boat-charter",
      },
      {
        id: "ac-itin-5",
        type: "transfer",
        title: "Transfer to Positano",
        subtitle: "Ravello → Positano",
        location: "Ravello, Italy",
        startDate: "May 22, 2025",
      },
      {
        id: "ac-itin-6",
        type: "hotel",
        title: "Le Sirenuse",
        subtitle: "Classic Room · 7 nights",
        location: "Positano, Italy",
        startDate: "May 22, 2025",
        endDate: "May 29, 2025",
      },
      {
        id: "ac-itin-7",
        type: "flight",
        title: "Return Flight",
        subtitle: "NAP → LHR · easyJet EZY8932",
        location: "Naples, Italy",
        startDate: "May 29, 2025",
      },
    ],
    threads: [
      {
        id: "villa-cimbrone",
        operatorName: "Villa Cimbrone",
        channel: "email",
        lastMessagePreview: "Suite Belvedere is reserved for May 19–22. Welcome flowers requested.",
        lastMessageTime: "Feb 17, 4:00 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "vc-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 16, 2:00 PM",
            body: "Dear Villa Cimbrone, please confirm the reservation for Ms. Victoria Chen — Suite Belvedere, May 19–22. She'll be traveling solo and would appreciate a warm welcome. Could you arrange a floral arrangement upon arrival?"
          },
          {
            id: "vc-2",
            role: "inbound",
            sender: "Villa Cimbrone",
            timestamp: "Feb 17, 4:00 PM",
            body: "Eleanor, Suite Belvedere is reserved for May 19–22. Welcome flowers have been requested from our local florist. We look forward to welcoming Ms. Chen."
          }
        ]
      },
      {
        id: "boat-charter",
        operatorName: "Positano Boat Charters",
        channel: "whatsapp",
        lastMessagePreview: "Ciao! Half-day to Capri on May 21 is available. Sending options now.",
        lastMessageTime: "Today, 7:50 AM",
        unread: true,
        unreadCount: 2,
        pendingDraft: true,
        status: "active",
        messages: [
          {
            id: "pb-1",
            role: "outbound",
            sender: "You",
            timestamp: "Today, 7:00 AM",
            body: "Ciao! I'm looking for a private boat charter — half-day to Capri for one guest on May 21. Do you have availability?"
          },
          {
            id: "pb-2",
            role: "inbound",
            sender: "Luca — Positano Charters",
            timestamp: "Today, 7:50 AM",
            body: "Ciao! Half-day to Capri on May 21 is available. Sending options now — we have a Gozzo Sorrentino (classic wooden boat) and a modern Riva. Both include skipper and snorkeling stop. Which would you prefer?"
          }
        ]
      }
    ]
  },
  {
    id: "japan-rail",
    clientName: "The Harrington Family",
    destination: "Japan Rail Journey",
    travelDates: "Apr 28 – May 11, 2025",
    awaitingResponse: 0,
    draftsForReview: 2,
    itinerary: [
      {
        id: "jr-itin-1",
        type: "flight",
        title: "Flight to Tokyo",
        subtitle: "LHR → HND · ANA NH211",
        location: "London Heathrow",
        startDate: "Apr 28, 2025",
        notes: "Business class. Departs 13:15.",
      },
      {
        id: "jr-itin-2",
        type: "transfer",
        title: "Private Transfer from Haneda",
        subtitle: "Haneda Airport → Aman Tokyo",
        location: "Haneda Airport, Tokyo",
        startDate: "Apr 28, 2025",
        operatorName: "Aman Tokyo",
        threadId: "aman-tokyo",
      },
      {
        id: "jr-itin-3",
        type: "hotel",
        title: "Aman Tokyo",
        subtitle: "Two Aman Suites · 4 nights",
        location: "Tokyo, Japan",
        startDate: "Apr 28, 2025",
        endDate: "May 2, 2025",
        operatorName: "Aman Tokyo",
        threadId: "aman-tokyo",
      },
      {
        id: "jr-itin-4",
        type: "train",
        title: "Shinkansen to Kyoto",
        subtitle: "Tokyo → Kyoto · Nozomi · JR Pass",
        location: "Tokyo Station",
        startDate: "May 2, 2025",
        notes: "2 hours 15 minutes journey.",
      },
      {
        id: "jr-itin-5",
        type: "hotel",
        title: "The Celestine Kyoto Gion",
        subtitle: "3 rooms · 3 nights",
        location: "Kyoto, Japan",
        startDate: "May 3, 2025",
        endDate: "May 6, 2025",
        operatorName: "The Celestine Kyoto Gion",
        threadId: "the-celestine",
        notes: "Private tea ceremony May 4 at 4:00 PM with Sensei Okamoto.",
      },
      {
        id: "jr-itin-6",
        type: "activity",
        title: "Private Tea Ceremony",
        subtitle: "Sensei Okamoto · Family experience",
        location: "Kyoto, Japan",
        startDate: "May 4, 2025",
        operatorName: "The Celestine Kyoto Gion",
        threadId: "the-celestine",
      },
      {
        id: "jr-itin-7",
        type: "train",
        title: "Seven Stars in Kyushu",
        subtitle: "Fukuoka → Kyushu Loop · Waitlist #2",
        location: "Hakata Station, Fukuoka",
        startDate: "May 3, 2025",
        operatorName: "Seven Stars Kyushu",
        threadId: "seven-stars",
        notes: "Waitlisted — awaiting confirmation.",
      },
      {
        id: "jr-itin-8",
        type: "flight",
        title: "Return Flight",
        subtitle: "KIX → LHR · ANA NH212",
        location: "Kansai International Airport",
        startDate: "May 11, 2025",
      },
    ],
    threads: [
      {
        id: "the-celestine",
        operatorName: "The Celestine Kyoto Gion",
        channel: "email",
        lastMessagePreview: "Reservation confirmed for 3 rooms, May 3–6. Tea ceremony arranged.",
        lastMessageTime: "Feb 17, 1:30 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "tc-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 15, 9:00 AM",
            body: "Hello, I'd like to book 3 standard rooms at The Celestine Kyoto Gion for the Harrington family — 2 adults, 2 children (ages 8 & 11) — from May 3–6. Could you also arrange a private tea ceremony experience for the family?"
          },
          {
            id: "tc-2",
            role: "inbound",
            sender: "The Celestine",
            timestamp: "Feb 17, 1:30 PM",
            body: "Dear Eleanor, reservation confirmed for 3 rooms, May 3–6. We have arranged a private tea ceremony with Sensei Okamoto on May 4 at 4:00 PM. He works wonderfully with children. We look forward to welcoming the family."
          }
        ]
      },
      {
        id: "seven-stars",
        operatorName: "Seven Stars Kyushu",
        channel: "email",
        lastMessagePreview: "Waitlist position #2 for the May 3 departure. Will notify immediately if a spot opens.",
        lastMessageTime: "Feb 14, 5:20 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "awaiting_response",
        messages: [
          {
            id: "ss-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 12, 11:00 AM",
            body: "I'd like to enquire about availability on the Seven Stars in Kyushu for 4 passengers departing May 3. This is for the Harrington family — 2 adults, 2 children. Please let me know if any cabin configurations are suitable."
          },
          {
            id: "ss-2",
            role: "inbound",
            sender: "Seven Stars Reservations",
            timestamp: "Feb 14, 5:20 PM",
            body: "Dear Eleanor, unfortunately the May 3 departure is fully booked. We have placed you at waitlist position #2 and will notify you immediately if a spot becomes available. The next available departure is June 1."
          }
        ]
      },
      {
        id: "aman-tokyo",
        operatorName: "Aman Tokyo",
        channel: "email",
        lastMessagePreview: "Two Aman Suites confirmed for Apr 28–May 2. Airport transfer arranged.",
        lastMessageTime: "Feb 10, 3:00 PM",
        unread: false,
        unreadCount: 0,
        pendingDraft: false,
        status: "confirmed",
        messages: [
          {
            id: "at-1",
            role: "outbound",
            sender: "You",
            timestamp: "Feb 8, 10:30 AM",
            body: "Dear Aman Tokyo, I'd like to confirm availability for the Harrington family (4 guests) from April 28 – May 2. Two interconnecting suites would be ideal. Please also arrange a private airport transfer from Haneda."
          },
          {
            id: "at-2",
            role: "inbound",
            sender: "Aman Tokyo",
            timestamp: "Feb 10, 3:00 PM",
            body: "Dear Eleanor, two Aman Suites have been confirmed for April 28 – May 2. A private transfer from Haneda Airport has been arranged for your guests' arrival. We look forward to welcoming the Harrington family."
          }
        ]
      }
    ]
  }
];

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

export interface OperatorSummary {
  name: string;
  channels: Channel[];
  tripCount: number;
  tripNames: string[];
  lastContactedTime: string;
  threadRefs: { tripId: string; threadId: string; tripName: string }[];
}

export function getUniqueOperators(): OperatorSummary[] {
  const map = new Map<string, OperatorSummary>();
  for (const trip of trips) {
    for (const thread of trip.threads) {
      const existing = map.get(thread.operatorName);
      if (existing) {
        if (!existing.channels.includes(thread.channel)) {
          existing.channels.push(thread.channel);
        }
        if (!existing.tripNames.includes(trip.destination)) {
          existing.tripNames.push(trip.destination);
          existing.tripCount += 1;
        }
        existing.threadRefs.push({ tripId: trip.id, threadId: thread.id, tripName: trip.destination });
        // Keep most recent time (simple string comparison — good enough for mockup)
        if (thread.lastMessageTime > existing.lastContactedTime) {
          existing.lastContactedTime = thread.lastMessageTime;
        }
      } else {
        map.set(thread.operatorName, {
          name: thread.operatorName,
          channels: [thread.channel],
          tripCount: 1,
          tripNames: [trip.destination],
          lastContactedTime: thread.lastMessageTime,
          threadRefs: [{ tripId: trip.id, threadId: thread.id, tripName: trip.destination }],
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
