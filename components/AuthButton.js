"use client";

import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

import { signOut } from "@/actions/auth.actions";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";

export default function AuthButton({ user }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user) {
    return (
      <form action={signOut}>
        <Button size="sm" variant="ghost" type="submit" className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </form>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="default"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
        onClick={() => setShowAuthModal(true)}
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
