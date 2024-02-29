import { Server } from "socket.io";

export const startIOLoop = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("connected ", socket.id);
        socket.on("vote-cast", (vote: any) => {
            // console.log({vote});
            io.emit("vote-update", vote);
        });
        socket.on("delete-suggestion", (deletedSuggestion: any) => {
            // console.log({deletedSuggestion});
            io.emit("delete-suggestion", deletedSuggestion);
        })
        socket.on("new-post", () => {
            io.emit("new-post");
        })

        
    });
}



