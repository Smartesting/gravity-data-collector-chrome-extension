![GitHub action badge](https://github.com/Smartesting/gravity-data-collector-chrome-extension/actions/workflows/build-zip.yml/badge.svg)


## Introduction

This project has been created from a template of Chrome Extension Boilerplate ([README](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite#readme))


## Procedures

1. Clone this repository.
2. Install pnpm globally: `npm install -g pnpm` (check your node version >= 16.6, recommended >= 18)
3. Run `pnpm install`
4. Run `npx husky install` to install husky hook


### And next, depending on the needs:

#### For Chrome:

1. Run:
    - Dev: `pnpm dev` or `npm run dev`
    - Prod: `pnpm build` or `npm run build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder

#### For Firefox:

1. Run:
    - Dev: `pnpm dev:firefox` or `npm run dev:firefox`
    - Prod: `pnpm build:firefox` or `npm run build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder

