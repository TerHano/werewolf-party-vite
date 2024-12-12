import { AddEditPlayerModal } from "@/components/Lobby/AddEditPlayerModal";
import { APIResponse } from "@/dto/APIResponse";
import { useIsPlayerInRoom } from "@/hooks/useIsPlayerInRoom";
import { useModerator } from "@/hooks/useModerator";
import { getCookie } from "@/util/cookie";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/room/$roomId")({
  component: RouteComponent,
  loader: async ({ params: { roomId } }) => {
    const token = getCookie("session");
    return await fetch(
      `${import.meta.env.WEREWOLF_SERVER_URL}/api/room/${roomId}/is-player-in-room`,
      {
        method: "GET",
        headers: new Headers({
          Authorization: "Bearer " + token,
        }),
      }
    )
      .then((res) => res.json())
      .then((response: APIResponse<boolean>) => {
        if (response.success && response.data !== undefined) {
          return response.data;
        }
        throw new Error("Error checking player");
      });
  },
});

function RouteComponent() {
  const { roomId } = Route.useParams();
  const _isPlayerAlreadyInRoomInitialData = Route.useLoaderData();
  const { data: isPlayerAlreadyInRoom } = useIsPlayerInRoom({
    roomId,
    options: {
      initialData: true,
    },
  });
  return (
    <>
      {isPlayerAlreadyInRoom ? (
        <div>Hello in room {roomId}</div>
      ) : (
        <AddEditPlayerModal />
      )}
    </>
  );
}
