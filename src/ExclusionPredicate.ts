import React from "react";

export type ExclusionPredicate = (
  ...argumentsList: Parameters<typeof React.createElement>
) => boolean;
