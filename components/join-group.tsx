import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function JoinGroup() {
  const [groupCode, setGroupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoinGroup = async () => {
    // Check for valid group code format
    const validGroupCodeRegex = /^[A-Z]{3}-[A-Z]{3}$/;
    if (!validGroupCodeRegex.test(groupCode)) {
      setError("Invalid group code format. Please use the format XXX-XXX.");
      return;
    }

    setIsLoading(true);
    setError(""); // Reset error state on new submission

    // Send a POST request to the server-side API endpoint
    const response = await fetch("/api/joingroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupCode }),
    });

    const data = await response.json();
    setIsLoading(false);

    // Handling based on the response from the API
    if (response.ok) {
      // Redirect to the dashboard if the operation was successful
      router.push("/dashboard");
    } else {
      // If the user is not logged in or if there is another error, handle accordingly
      if (data.error === "User not authenticated") {
        router.push("/login?group=join");
      } else {
        setError(data.message || "Failed to join the group.");
      }
    }
  };

  return (
    <Card className="w-full mt-9 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl sm:text-3xl">
          Join an existing group
        </CardTitle>
        <CardDescription>
          Join an already created group by inputting the group code below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="KBX-QGN"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          className="w-1/2"
          onClick={handleJoinGroup}
          disabled={isLoading}
        >
          Join
        </Button>
      </CardFooter>
    </Card>
  );
}

export default JoinGroup;
