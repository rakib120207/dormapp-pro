import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, generateAvatarColor, cn } from "@/lib/utils";

interface UserAvatarProps {
  nickname: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function UserAvatar({ nickname, avatarUrl, size = "md", className }: UserAvatarProps) {
  const bgColor = generateAvatarColor(nickname);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={nickname} />}
      <AvatarFallback className={cn(bgColor, "text-white font-bold")}>
        {getInitials(nickname)}
      </AvatarFallback>
    </Avatar>
  );
}