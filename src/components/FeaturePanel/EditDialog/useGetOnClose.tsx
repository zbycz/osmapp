import { useRouter } from 'next/router';
import { useEditDialogContext } from '../helpers/EditDialogContext';
import { useEditContext } from './EditContext';

export const useGetOnClose = () => {
  const router = useRouter();
  const { close } = useEditDialogContext();
  const { successInfo } = useEditContext();

  return () => {
    close();
    if (successInfo?.redirect) {
      router.replace(successInfo.redirect); // only useRouter reloads the panel client-side
    }
  };
};
