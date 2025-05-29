import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrentUserWithReservations } from '@/actions/user.actions';
import DeleteButton from '@/components/DeleteButton';
import UpdateProfileDialog from '@/components/UpdateProfile';

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
                <p className="text-white/80 md:text-base text-sm">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:text-base text-white">
              <p><strong>Phone Number:</strong> {user.phone_number}</p>
              <p><strong>Card Number:</strong> **** **** **** {user.cardnumber.toString().slice(-4)}</p>
            </div>
            <UpdateProfileDialog
            initialUsername={user.username}
            initialCardnumber={user.cardnumber}
            />
          </CardContent>
        </Card>

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
                    <TableHead className="text-white md:text-base text-sm">Reservation ID</TableHead>
                    <TableHead className="text-white md:text-base text-sm">Departure Airport</TableHead>
                    <TableHead className="text-white md:text-base text-sm">Arrival Airport</TableHead>
                    <TableHead className="text-white md:text-base text-sm">Departure Date</TableHead>
                    <TableHead className="text-white md:text-base text-sm">Country</TableHead>
                    <TableHead className="text-white md:text-base text-sm">Airline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.reservations.map((reservation) => (
                    <TableRow key={reservation.reservation_id}>
                      <TableCell className="text-white md:text-base text-sm border-none">{reservation.reservation_id}</TableCell>
                      <TableCell className="text-white md:text-base text-sm border-none">{reservation.airport_name}</TableCell>
                      <TableCell className="text-white md:text-base text-sm border-none">{reservation.arrival_airport}</TableCell>
                      <TableCell className="text-white md:text-base text-sm border-none">
                        {new Date(reservation.departure_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white md:text-base text-sm">{reservation.country}</TableCell>
                      <TableCell className="text-white md:text-base text-sm">{reservation.airline}</TableCell>
                      <TableCell>
                      <DeleteButton reservation_id={reservation.reservation_id}/>
                      </TableCell>
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