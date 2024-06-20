import { ManageQueueService } from "src/app/core/services/manage-queue.service";
import { CarQueue } from "src/app/data/models/CarQueue";


export function addTraffic(
  direction: string,
  carQueue: CarQueue,
  manageQueueService: ManageQueueService,
  getter: () => void,
  setter: (newTraffic: any) => void,
  emitChange: () => void
) {
  let timer = generateRandomNumber();
  console.log(direction, timer);

  setTimeout(() => {
    manageQueueService.beforQueueFirst();

    setter(carQueue);
    console.log(carQueue.before);
    emitChange();
    addTraffic(direction, carQueue, manageQueueService, getter, setter, emitChange);
  }, timer);
}

function generateRandomNumber(): number {
  return 1000 * (Math.floor(Math.random() * (30 - 10 + 1)) + 10);
}


export function generateRandomLicensePlate() {
  const min = 6;
  const max = 8;
  const numbers = '0123456789';

  const length = Math.floor(Math.random() * (max - min + 1)) + min;

  let licensePlate = '';
  for (let i = 0; i < length; i++) {
    licensePlate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return licensePlate;

}
