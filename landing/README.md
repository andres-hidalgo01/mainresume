# MainResume

Digital resume and private access portal built with Astro.

This project contains a public landing page and a private digital resume experience designed for recruiters, HR contacts, and professional opportunities.

## Overview

The goal of this project is to keep a clean public profile while allowing selected people to access a more complete version of the resume through a temporary private link.

The private access flow uses a magic link sent by email. Once the link is used, the visitor can access the private resume for a limited time. After that time expires, the system automatically blocks access and redirects the visitor back to the access screen.

## Main Features

- Public landing page.
- Private resume page.
- Temporary access by email.
- Magic link authentication.
- Automatic access expiration.
- Basic access logging.
- Email notification when someone accesses the private resume.
- Responsive and modern UI.
- Separate public and private experience.

## Project Structure

```txt
mainresume/
  landing/
    public/
    src/
      components/
      data/
      layouts/
      pages/
      lib/
      middleware.ts