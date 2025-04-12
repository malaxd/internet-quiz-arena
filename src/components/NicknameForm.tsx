
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface NicknameFormProps {
  onSetNickname: (nickname: string) => void;
  currentNickname?: string;
}

const NicknameForm: React.FC<NicknameFormProps> = ({ onSetNickname, currentNickname }) => {
  const [nickname, setNickname] = useState(currentNickname || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        title: "Błąd",
        description: "Podaj swój nick!",
        variant: "destructive"
      });
      return;
    }
    
    if (nickname.length > 20) {
      toast({
        title: "Błąd",
        description: "Nick nie może być dłuższy niż 20 znaków!",
        variant: "destructive"
      });
      return;
    }
    
    onSetNickname(nickname);
    
    toast({
      title: "Gotowe!",
      description: `Ustawiono nick: ${nickname}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="Twój nick"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">Ustaw nick</Button>
    </form>
  );
};

export default NicknameForm;
