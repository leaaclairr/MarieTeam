import { BookingModel } from './model/BookingModel.js';
import { BookingView } from './view/BookingView.js';
import { BookingController } from './controller/BookingController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new BookingModel();
    const view = new BookingView();
    const controller = new BookingController(model, view);

    controller.init();
});