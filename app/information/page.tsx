import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Information() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Join the Group</h2>
        <p className="text-gray-500 dark:text-gray-400">Enter your information to join the group</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Enter your first name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Enter your last name" />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="group">Group Code (optional)</Label>
            <Input id="group" placeholder="Enter your group" />
          </div>
        </div>
        <Button>Join</Button>
      </div>
    </div>
  )
}

