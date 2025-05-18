import { User } from "@/types/user";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal"
import DatePicker from "../form/date-picker";
import { useState } from "react";
import { notification } from "antd";
import { setUserVip } from "@/app/actions";

interface SetVipModalProps {
    isOpen: boolean;
    user: User;
    closeModal: () => void;
    onSuccess?: () => void;
}

export const SetVipModal = ({ isOpen, closeModal, user, onSuccess }: SetVipModalProps) => {
    const [date, setDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        if (!date) {
            notification.error({
                placement: 'topRight',
                message: 'Invalid Date',
            })
            setIsLoading(false);

            return;
        }

        const response = await setUserVip(user.id, date);

        setIsLoading(false);

        if (response) {
            notification.success({
                placement: 'topRight',
                message: 'VIP status updated successfully',
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
                Set {user.name}&apos;s VIP Information
            </h4>

            <DatePicker
                id="date-picker"
                label="Vip Expiration Date"
                placeholder="Select a date"
                onChange={(dates) => {
                    setDate(dates[0]);
                }}
            />

            <div className="flex items-center justify-end w-full gap-3 mt-6">
                <Button disabled={isLoading} size="sm" variant="outline" onClick={closeModal}>
                    Close
                </Button>
                <Button loading={isLoading} size="sm" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </div>
    </Modal>
}