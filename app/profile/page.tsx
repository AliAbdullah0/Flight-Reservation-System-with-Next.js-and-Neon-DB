import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUserWithReservations } from '@/actions/user.actions';

type CurrentUserResponse = {
  user_id: number;
  username: string;
  phone_number: number;
  email: string;
  cardnumber: number;
  reservations: Reservation[];
} | null;

type ProfileProps = {
  user: CurrentUserResponse;
};

const Profile = async () => {
  const user: CurrentUserResponse = await getCurrentUserWithReservations();

  if (!user) {
    return (
      <section className="flex flex-col p-4 w-full min-h-screen items-center justify-center">
        <Card className="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col p-4 items-center justify-center w-full min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <Card className="bg-white/10 border border-white/20 rounded-2xl mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={user.username} />
                <AvatarFallback className="bg-white/20 text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold text-white">{user.username}</CardTitle>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-white">
              <p><strong>Phone Number:</strong> {user.phone_number}</p>
              <p><strong>Card Number:</strong> **** **** **** {user.cardnumber.toString().slice(-4)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Reservations Card */}
        <Card className="bg-white/10 border border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Your Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {user.reservations.length === 0 ? (
              <p className="text-white/80">No reservations found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Reservation ID</TableHead>
                    <TableHead className="text-white">Departure Airport</TableHead>
                    <TableHead className="text-white">Arrival Airport</TableHead>
                    <TableHead className="text-white">Departure Date</TableHead>
                    <TableHead className="text-white">Country</TableHead>
                    <TableHead className="text-white">Airline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.reservations.map((reservation) => (
                    <TableRow key={reservation.reservation_id}>
                      <TableCell className="text-white border-none">{reservation.reservation_id}</TableCell>
                      <TableCell className="text-white border-none">{reservation.airport_name}</TableCell>
                      <TableCell className="text-white border-none">{reservation.arrival_airport}</TableCell>
                      <TableCell className="text-white border-none">
                        {new Date(reservation.departure_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">{reservation.country}</TableCell>
                      <TableCell className="text-white">{reservation.airline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Profile;