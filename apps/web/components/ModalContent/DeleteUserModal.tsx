import Modal from "../Modal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { useDeleteUser } from "@linkwarden/router/users";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useConfig } from "@linkwarden/router/config";
import { Separator } from "../ui/separator";

type Props = {
  onClose: Function;
  userId: number;
};

export default function DeleteUserModal({ onClose, userId }: Props) {
  const { t } = useTranslation();

  const [submitLoader, setSubmitLoader] = useState(false);
  const deleteUser = useDeleteUser();

  const submit = async () => {
    if (!submitLoader) {
      setSubmitLoader(true);

      await deleteUser.mutateAsync(userId, {
        onSuccess: () => {
          onClose();
        },
        onSettled: (data, error) => {
          setSubmitLoader(false);
        },
      });
    }
  };

  const { data } = useSession();

  const { data: config } = useConfig();

  const isAdmin = data?.user?.id === config?.ADMIN;

  return (
    <Modal toggleModal={onClose}>
      <p className="text-xl font-thin text-red-500">
        {isAdmin ? t("delete_user") : t("remove_user")}
      </p>

      <Separator className="my-3" />

      <div className="flex flex-col gap-3">
        <p>{t("confirm_user_deletion")}</p>
        <p>{t("confirm_user_removal_desc")}</p>

        {isAdmin && (
          <div role="alert" className="alert alert-warning">
            <i className="bi-exclamation-triangle text-xl" />
            <span>
              <b>{t("warning")}:</b> {t("irreversible_action_warning")}
            </span>
          </div>
        )}

        <Button className="ml-auto" variant="destructive" onClick={submit}>
          <i className="bi-trash text-xl" />
          {isAdmin ? t("delete_confirmation") : t("confirm")}
        </Button>
      </div>
    </Modal>
  );
}
