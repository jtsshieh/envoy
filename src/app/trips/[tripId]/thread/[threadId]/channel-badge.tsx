import { type Thread } from "@/lib/data";
import { Mail, MessageCircle, Phone } from "lucide-react";

export function ChannelBadge({ channel }: { channel: Thread["channel"] }) {
  if (channel === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <MessageCircle className="size-2.5" />
        WhatsApp
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
      <Phone className="size-2.5" />
      Phone
    </span>
  );
}

export function ChannelIcon({ channel }: { channel: Thread["channel"] }) {
  if (channel === "whatsapp")
    return <MessageCircle className="size-3.5 text-emerald-600" />;
  if (channel === "email") return <Mail className="size-3.5 text-sky-600" />;
  return <Phone className="size-3.5 text-slate-500" />;
}
