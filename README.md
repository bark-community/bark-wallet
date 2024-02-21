<div align="center">
  <img alt="BARK Wallet Header" src="https://github.com/bark-community/bark-wallet/blob/4cd356c02b0529148e0a5da5d57b4eb47a54e9b9/public/images/bark-wallet-header-light.png">
</div>

<p align="center"><strong>BARK Wallet is a secure and user-friendly wallet designed for managing BARK tokens on the Solana blockchain. It provides a seamless experience for users within the Solana ecosystem, allowing them to create and manage wallets, conduct secure BARK token transactions, integrate with Solana-based decentralized finance (DeFi) applications, and even swap tokens directly within the wallet interface.</strong></p>

<h4 align="center">POWERED BY SOLANA</h4>

<br>

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Demo](#demo)
- [Documentation](#documentation)
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Introduction](#introduction)
- [Features:](#features)
  - [Wallet Creation and Management](#wallet-creation-and-management)
  - [Transactions](#transactions)
  - [Transaction History](#transaction-history)
  - [Integration with Solana Ecosystem](#integration-with-solana-ecosystem)
  - [Swap Feature](#swap-feature)
    - [Key Highlights:](#key-highlights)
    - [How to Use the Swap Feature:](#how-to-use-the-swap-feature)
    - [Swap Feature Benefits:](#swap-feature-benefits)
- [Technology Stack](#technology-stack)
- [Additional Components](#additional-components)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Demo

Explore the [BARK Wallet Demo](http://bark-admin-dashboard-demo.vercel.sh/).

## Documentation

For detailed information on how to use BARK Wallet, refer to the [BARK Wallet Documentation](<Documentation URL>).

## Overview

BARK Wallet is built using the following stack:

- Framework - [Next.js 14](https://nextjs.org/14)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [NextAuth.js](https://next-auth.js.org)
- Database - [Vercel Postgres](https://vercel.com/postgres)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Tremor](https://www.tremor.so)
- Analytics - [Vercel Analytics](https://vercel.com/analytics)
- Linting - [ESLint](https://eslint.org)
- Formatting - [Prettier](https://prettier.io)

## Getting Started

During the deployment, Vercel will prompt you to create a new Postgres database. This will add the necessary environment variables to your project.

Inside the Vercel Postgres dashboard, create a table based on the schema defined in this repository.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  username VARCHAR(255)
);
```

Insert a row for testing:

```sql
INSERT INTO users (id, email, name, username) VALUES (1, 'me@site.com', 'Me', 'username');
```

Finally, run the following commands to start the development server:

```bash
pnpm install
pnpm dev
```

You should now be able to access the application at http://localhost:3000.

## Introduction

Bark Wallet is a specialized wallet application tailored for managing BARK tokens on the Solana blockchain. With the increasing prominence of decentralized finance (DeFi) applications and the Solana ecosystem, there arises a need for a dedicated wallet solution focused on the secure and efficient handling of BARK tokens.

This project aims to deliver a user-friendly and secure platform, providing features such as wallet creation, BARK token transactions, transaction history tracking, seamless integration with Solana-based DeFi applications, and a powerful Swap feature directly within the wallet.

Security is a paramount consideration, encompassing end-to-end encryption for data transmission, secure key storage, and multi-factor authentication. The user experience is designed to be intuitive, ensuring accessibility for both novice and experienced users.

Through this endeavor, we anticipate contributing to the growth and accessibility of the Solana ecosystem while offering users a reliable and feature-rich solution for managing their BARK tokens.

## Features:

### Wallet Creation and Management

Users can easily create and manage their BARK wallets securely.

### Transactions

Facilitate secure and efficient transactions of cryptocurrencies and BARK tokens with ease.

### Transaction History

Maintain a transparent and accessible record of all BARK transactions.

### Integration with Solana Ecosystem

Seamlessly integrate with Solana-based DeFi applications to enhance user interaction.

### Swap Feature

BARK Wallet includes a powerful Swap feature, allowing users to exchange BARK tokens seamlessly within the wallet. This feature is designed to enhance user flexibility and provide a convenient way to trade tokens directly from the wallet interface.

#### Key Highlights:

- **User-Friendly Interface**: The Swap feature offers an intuitive and user-friendly interface, making it easy for users to initiate token swaps.

- **Token Pair Selection**: Users can choose from a variety of token pairs for swapping, providing flexibility in trading options.

- **Real-time Price Updates**: The Swap feature displays real-time price updates, ensuring users have accurate information before confirming a swap.

- **Transaction History Integration**: Swap transactions are seamlessly integrated into the wallet's transaction history, providing users with a comprehensive overview of their token activities.

#### How to Use the Swap Feature:

1. **Navigate to the Swap Section**:
   Open the BARK Wallet application and navigate to the "Swap" section.

2. **Select Token Pair**:
   Choose the token pair you wish to swap. The interface will display current prices and other relevant information.

3. **Enter Swap Details**:
   Enter the amount of BARK tokens you want to swap and review the details of the transaction.

4. **Confirm and Execute**:
   Once you are satisfied with the details, confirm the swap, and execute the transaction. The Swap feature will handle the necessary steps to complete the swap securely.

#### Swap Feature Benefits:

- **Convenience**: Swap tokens directly within the wallet without the need for external exchanges.

- **Cost-Efficiency**: Users can save on fees by avoiding multiple transactions on external platforms.

- **Integrated Experience**: The Swap feature is seamlessly integrated into the BARK Wallet, providing a cohesive and streamlined experience for users managing their BARK tokens.

## Technology Stack

- **Front-end**: React 17
- **Blockchain Interaction**: Solana SDK, Solana Web3.js
- **Programs (Smart Contract) Integration**: TypeScript, Anchor, Rust, and Solidity
- **Security Measures**: End-to-end encryption, Multi-factor authentication

## Additional Components

In addition to the core technology stack, BARK Wallet leverages the following components:

- **Bark Wallet Metadata**: The [Bark Wallet Metadata](https://github.com/bark-community/bark-wallet-metadata) repository serves as a centralized store for metadata related to Bark Wallet, BARK tokens, cryptocurrencies, and fiat currencies. It includes essential information such as logos, symbols, and other relevant details, enhancing the overall user experience.

- **Memo Program**: The [BARK Memo Program](https://github.com/bark-community/solana-memo-program) is a Solana program designed to enhance transaction information

 on the Solana blockchain. This program adds additional context to transactions, contributing to a richer transaction experience within the Bark Wallet.

These additional components play a crucial role in providing comprehensive information, improving the visual aspects of the wallet, and enhancing transaction details on the Solana blockchain.

## Contributing

We welcome contributions from the community. If you have suggestions, bug reports, or would like to contribute to the development of Bark Wallet, please follow our [Contribution Guidelines](CONTRIBUTING.md).

## Troubleshooting

If you encounter any issues during installation or development, please refer to our [Troubleshooting Guide](<Link to Troubleshooting Guide>) for assistance.

## Acknowledgments

We would like to express our gratitude to the following contributors and projects that have played a crucial role in the development of BARK Wallet.

## License

[MIT License](LICENSE).