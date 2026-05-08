# BloodBridge SOA

A service-oriented architecture platform for managing blood donations, facilitating connections between donors and recipients.

## Technology Stack

- **Frontend**: React 19 with Vite
- **Backend Services**: Node.js with Express.js
- **Deployment**: Docker

## Services

- **Notification Service**: Handles notifications and communications
- **Location Service**: Manages location-based functionalities

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bloodbridge-soa
   ```

2. Install dependencies for client:
   ```bash
   cd client
   npm install
   ```

3. Install dependencies for services:
   ```bash
   cd ../services/notification-service
   npm install
   cd ../location-service
   npm install
   ```

## Usage

1. Start the services:
   ```bash
   # Notification Service
   cd services/notification-service
   npm start

   # Location Service (in another terminal)
   cd services/location-service
   npm start
   ```

2. Start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Contributing

Contributions are welcome. Please submit issues and pull requests.

## License

[Specify license here]# Pipeline test
hhhh