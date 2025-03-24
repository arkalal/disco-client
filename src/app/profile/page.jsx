"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a default profile
    router.push("/profile/srkkingk555");
  }, [router]);

  return (
    <div className="loading-container">
      <p>Loading profile...</p>
    </div>
  );
}
