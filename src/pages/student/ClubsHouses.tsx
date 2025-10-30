import { Trophy, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ClubsHouses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clubs & Houses</h1>
        <p className="text-muted-foreground mt-2">Join clubs and represent your house</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Clubs or Houses Available</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Club and house information will be added by administrators. Check back later to join clubs and view house activities.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Coming Soon
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Administrators will set up houses (Red, Blue, Green, Orange) and various clubs. You'll be able to join clubs, track points, and participate in house competitions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}