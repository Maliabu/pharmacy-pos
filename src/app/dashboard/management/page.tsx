import AddUser from "@/app/auth/page"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Page() {
  return (
    <Tabs defaultValue="user" className="sm:w-[800px]">
        <div className="text-3xl font-bold tracking-tight sm:my-4 m-4 sm:mx-0">Add</div>
      <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="user" className="p-2 border-none">Users</TabsTrigger>
        <TabsTrigger value="stock" className="p-2 border-none">Stock</TabsTrigger>
        </TabsList>
      <TabsContent value="user">
      <Card className="shadow-none border-none">
        <AddUser/>
        </Card>
      </TabsContent>
      <TabsContent value="stock">
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
