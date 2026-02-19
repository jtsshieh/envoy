import { type Thread } from "@/lib/data";
import { Mail, MessageCircle, MessageSquareText, Phone } from "lucide-react";

export function ChannelBadge({ channel }: { channel: Thread["channel"] }) {
  if (channel === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <MessageCircle className="size-2.5" />
        WhatsApp
      </span>
    );
  }
  if (channel === "sms") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
        <MessageSquareText className="size-2.5" />
        SMS
      </span>
    );
  }
  if (channel === "email") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700 border border-sky-200">
        <Mail className="size-2.5" />
        Email
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      <Phone className="size-2.5" />
      Phone
    </span>
  );
}

export function ChannelIcon({ channel }: { channel: Thread["channel"] }) {
  if (channel === "whatsapp")
    return <MessageCircle className="size-3.5 text-emerald-600" />;
  if (channel === "sms")
    return <MessageSquareText className="size-3.5 text-indigo-600" />;
  if (channel === "email") return <Mail className="size-3.5 text-sky-600" />;
  return <Phone className="size-3.5 text-amber-600" />;
}
