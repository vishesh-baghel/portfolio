#!/usr/bin/env node
import {
  runServer
} from "./chunk-UM3QKH3K.js";
import "./chunk-XQADMHCP.js";

// src/stdio.ts
runServer().catch((error) => {
  const errorMessage = "Fatal error running server";
  console.error(errorMessage, error);
  process.exit(1);
});
