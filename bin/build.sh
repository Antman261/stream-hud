#!/usr/bin/env bash

(tsc && vite build) 
(cd stream-server && deno task compile-native) 
