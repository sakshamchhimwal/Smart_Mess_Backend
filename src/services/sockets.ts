import { Server } from "socket.io";

export const startIOLoop = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("connected ", socket.id);
        socket.on("vote-cast", (vote: any) => {
            // console.log({vote});
            socket.emit("vote-update", vote);
        });
        socket.on("delete-suggestion", (deletedSuggestion: any) => {
            console.log({deletedSuggestion});
            socket.emit("delete-suggestion", deletedSuggestion);
        })
    });
}



