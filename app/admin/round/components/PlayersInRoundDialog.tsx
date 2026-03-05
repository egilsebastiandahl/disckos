// import { Event } from "@/app/types/event.model";
// import { SimplePlayer } from "@/app/types/player.model";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "radix-ui";
// import PlayersInRoundChooser from "./PlayersInRoundChooser";

// interface PlayersInRoundDialogProps {
//     selectedEvent: Event | null;
//     activePlayers: SimplePlayer[];
//     setActivePlayers: (players: SimplePlayer[]) => void;
// }

// export default function PlayersInRoundDialog({ selectedEvent, activePlayers, setActivePlayers }: PlayersInRoundDialogProps) {

//     return (
//         <Dialog>
//             <form>
//                 <DialogTrigger asChild>
//                     <Button variant="outline">Open Dialog</Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-sm">
//                     <DialogHeader>
//                         <DialogTitle>Edit profile</DialogTitle>
//                         <DialogDescription>
//                             Make changes to your profile here. Click save when you&apos;re
//                             done.
//                         </DialogDescription>
//                     </DialogHeader>
//                     <PlayersInRoundChooser selectedEvent={selectedEvent} activePlayers={activePlayers} setActivePlayers={setActivePlayers} />
//                     <DialogFooter>
//                         <DialogClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </DialogClose>
//                         <Button type="submit">Save changes</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </form>
//         </Dialog>
//     )
// }

// //   <PlayersInRoundChooser selectedEvent={selectedEvent} activePlayers={activePlayers} setActivePlayers={setActivePlayers} />
