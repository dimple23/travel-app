import { handleSubmit } from './js/app';
import { updateUI } from './js/updateUI';

import './styles/main.scss';

document.getElementById('generate').addEventListener('click', handleSubmit)

export {
    handleSubmit,
    updateUI
}
