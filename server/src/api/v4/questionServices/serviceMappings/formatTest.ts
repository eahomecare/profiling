/* eslint-disable @typescript-eslint/no-var-requires */
// Import values using require
const homecareServiceDump =
  require('./homecareServiceDump').default;
console.log(
  'Imported homecareServiceDump:',
  homecareServiceDump,
);

// Import types using TypeScript import syntax
import type {
  Service,
  SubService,
} from '../interfaces/homecareServices.interface';

// Function to check if an object is a SubService
function isSubService(
  obj: any,
): obj is SubService {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'title' in obj &&
    'description' in obj
  );
}

// Function to validate the structure of homecareServiceDump
function validateHomecareServiceDump(
  services: Service[],
): void {
  services.forEach((service) => {
    if (
      typeof service.serviceId !== 'number' ||
      typeof service.serviceTitle !== 'string'
    ) {
      console.error(
        `Invalid Service with ID ${service.serviceId}:`,
        JSON.stringify(service, null, 2),
      );
    } else {
      service.subServices.forEach(
        (subService, subServiceIndex) => {
          if (!isSubService(subService)) {
            console.error(
              `Invalid SubService in Service ID ${service.serviceId}, SubService index ${subServiceIndex}:`,
              JSON.stringify(subService, null, 2),
            );
          }
        },
      );
    }
  });
}

// Validate the dump
validateHomecareServiceDump(homecareServiceDump);
