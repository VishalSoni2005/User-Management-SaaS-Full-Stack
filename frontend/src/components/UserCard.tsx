"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  firstName: string;
  lastName?: string;
  role: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

export default function UserCard({ user }: { user: User }) {
  const [editableField, setEditableField] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [hasChanged, setHasChanged] = useState(false);

  const handleFieldChange = (field: keyof User, value: string) => {
    setEditedUser({ ...editedUser, [field]: value });

    setHasChanged(true);
  };

  const handleSave = () => {
    console.log("Saving updated user:", editedUser);
    setEditableField(null);
    setHasChanged(false);
  };

  const joinedAt = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const FieldBlock = ({
    label,
    field,
    value,
  }: {
    label: string;
    field: keyof User;
    value?: string;
  }) => (
    <div
      className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 cursor-pointer hover:bg-zinc-800/60 transition"
      onClick={() => setEditableField(field)}
    >
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
        {label}
      </p>

      {editableField === field ? (
        <Input
          value={value ?? ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={() => setEditableField(null)}
          className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-500"
          autoFocus
        />
      ) : (
        <p className="text-sm text-white">{value || "—"}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen min-w-screen overflow-x-hidden flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-zinc-950 border border-zinc-800 text-white shadow-2xl rounded-2xl">
        <CardHeader className="relative flex flex-col items-center pt-8">
          <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-t-2xl"></div>

          <Avatar className="w-28 h-28 border-4 border-zinc-950 z-10 mt-8">
            <AvatarImage src={user.avatar} alt={user.firstName} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl">
              {user.firstName[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl font-bold mt-4">
            {editedUser.firstName} {editedUser.lastName ?? ""}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm mt-1">
            <Badge
              variant="outline"
              className="text-xs border-zinc-700 bg-zinc-900 text-zinc-300"
            >
              {editedUser.role}
            </Badge>
          </CardDescription>
        </CardHeader>

        <Separator className="bg-zinc-800 my-4" />

        <CardContent className="space-y-4">
          <FieldBlock
            label="First Name"
            field="firstName"
            value={editedUser.firstName}
          />
          <FieldBlock
            label="Last Name"
            field="lastName"
            value={editedUser.lastName}
          />
          <FieldBlock label="Email" field="email" value={editedUser.email} />


          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
              Role
            </p>
            <p className="text-sm text-white">{editedUser.role}</p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
              Joined At
            </p>
            <p className="text-sm text-white">{joinedAt}</p>
          </div>

          {hasChanged && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleSave}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              >
                Confirm Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
