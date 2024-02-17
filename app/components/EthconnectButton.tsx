"use client";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

function EthconnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="outlined" // Changed to "outlined" for transparent background with border
                    onClick={openConnectModal}
                    type="button"
                    sx={{
                      width: "100%",
                      borderColor: "white", // Set the border color
                      color: "white", // Ensure text color is white for visibility
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)", // Optional: subtle hover effect
                      },
                      "&.MuiButton-root": {
                        py: 2,
                        borderRadius: 2,
                        height: "42px",
                        minWidth: "216px",
                      },
                    }}
                  >
                    <Typography noWrap sx={{ fontSize: "12px" }}>
                      Connect Wallet
                    </Typography>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    variant="outlined" // Changed to "outlined" for a transparent background with border
                    onClick={openAccountModal}
                    type="button"
                    sx={{
                      width: "100%",
                      borderColor: "white", // Set the border color
                      color: "white", // Ensure text color is white for visibility
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)", // Optional: subtle hover effect
                      },
                      "&.MuiButton-root": {
                        py: 2,
                        borderRadius: 2,
                        height: "42px",
                        minWidth: "216px",
                      },
                    }}
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default EthconnectButton;
