'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';

export function BoardList() {
  const boards = useLiveQuery(() => db.boards.toArray(), []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {boards?.map(board => (
        <Card
          key={board.id}
          className="w-full hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Avatar className="h-10 w-10 border">
              {board.location.avatarURI ? (
                <AvatarImage
                  src={board.location.avatarURI}
                  alt={`Board avatar from ${board.location.name}`}
                />
              ) : (
                <AvatarFallback>
                  {board.location.projectKey.substring(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{board.name}</h3>
                <Badge variant="outline" className="text-xs font-normal">
                  {board.type}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-medium">{board.location.projectKey}</span>
                <span>•</span>
                <span className="truncate">{board.location.projectName}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex items-center justify-between">
            <div className="flex items-baseline gap-1 text-sm">
              <span className="text-muted-foreground">Board ID:</span>
              <span className="font-mono">{board.id}</span>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/${board.id}`}>View Board</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
