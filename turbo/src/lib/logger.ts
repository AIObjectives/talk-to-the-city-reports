import { success, error, info } from '$components/toast/theme';
import type { Log } from '$lib/node_data_types';

export function logger(node, showSuccess = true, showInfo = true, showError = true) {
  const log = (node.data.log = []);
  return {
    success: (m, detail) => {
      log.push({ title: m, detail: detail, type: 'success' } as Log);
      if (showSuccess) success(m);
    },
    error: (m, detail) => {
      log.push({ title: m, detail: detail, type: 'error' } as Log);
      if (showError) error(m);
    },
    info: (m, detail) => {
      log.push({ title: m, detail: detail, type: 'info' } as Log);
      if (showInfo) info(m);
    }
  };
}
