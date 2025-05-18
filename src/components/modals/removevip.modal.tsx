import { User } from "@/types/user";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal"
import { useState } from "react";
import { notification } from "antd";
import { removeVip } from "@/app/actions";

interface RemoveVipModalProps {
    isOpen: boolean;
    user: User;
    closeModal: () => void;
    onSuccess?: () => void;
}

export const RemoveVipModal = ({ isOpen, closeModal, user, onSuccess }: RemoveVipModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleRemove = async () => {
        setIsLoading(true);

        const response = await removeVip(user.id);

        setIsLoading(false);

        if (response) {
            notification.success({
                placement: 'topRight',
                message: `Removed ${user.name}'s VIP status successfully`,
            });
            closeModal();
            if (onSuccess) {
                onSuccess();
            }
        } else {
            notification.error({
                placement: 'topRight',
                message: 'Failed to update VIP status',
            });
        }
    }

    return <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
    >
        <div className="">
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                Remove {user.name}&apos;s VIP Information
            </h4>
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                Are you sure you want to remove the VIP status for {user.name}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button disabled={isLoading} size="sm" variant="outline" onClick={closeModal}>
                    Close
                </Button>
                <Button className="bg-error-500 hover:bg-error-600" loading={isLoading} size="sm" onClick={handleRemove}>
                    Remove
                </Button>
            </div>
        </div>
    </Modal>
}