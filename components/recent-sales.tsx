import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar"

export function RecentSales() {

  const requests = [
    {
      id: 1,
      name: "Paper Towels",
      cost: "5.00",
      user_submitted: "Josh B.",
    },
    {
      id: 1,
      name: "Paper Towels",
      cost: "25.00",
      user_submitted: "Joe B.",
    },
    {
      id: 1,
      name: "Paper Towels",
      cost: "13.00",
      user_submitted: "Josh B.",
    },
    {
      id: 1,
      name: "Paper Towels",
      cost: "1.00",
      user_submitted: "Josh B.",
    },
  ];
  return (
    <div className="space-y-8">
      {requests.map((item, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              - {item.user_submitted}
            </p>
          </div>
          <div className="ml-auto font-medium">${item.cost}</div>
        </div>
      ))}
    </div>
  )
}
