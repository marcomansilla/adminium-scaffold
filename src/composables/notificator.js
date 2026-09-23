import { Notify } from 'quasar';

export function GlobalNotificator(msg, type, icon='') {
  Notify.create({
    position: 'top',
    message: msg,
    timeout: 2500,
    type: type,
    icon: icon
  });
}
