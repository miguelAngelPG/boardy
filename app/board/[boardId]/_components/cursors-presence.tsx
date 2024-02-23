"use client";

import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { memo } from "react";
import { Cursor } from "./cursor";
import { Path } from "./path";
import { colorToCss } from "@/lib/utils";
import { shallow } from "@liveblocks/client";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => {
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export const CursorsPresence = memo(() => {
  return (
    <>
        <Drafts />
        <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";
