'use client';
import { useGetConfigs } from "@/hooks/config";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { updateConfig } from "@/app/actions";
import { notification, Spin } from "antd";

export default function ConfigsTable() {
    const { data, refetch, isLoading: isLoadData } = useGetConfigs();
    const [disabled, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [adProbability, setAdProbability] = useState<number>(data?.adsConfig.adProbability || 0);
    const [minTimeBetweenAds, setMinTimeBetweenAds] = useState<number>(data?.adsConfig.minTimeBetweenAds || 0);

    useEffect(() => {
        if (data) {
            setAdProbability(data.adsConfig.adProbability);
            setMinTimeBetweenAds(data.adsConfig.minTimeBetweenAds);
        }
    }, [data]);

    const handleSave = async () => {
        setIsLoading(true);

        const newValue = {
            adsConfig: {
                adProbability: adProbability,
                minTimeBetweenAds: minTimeBetweenAds
            }
        }

        try {
            await updateConfig(newValue);

            setDisable(true);
            refetch();

            notification.success({
                placement: 'topRight',
                message: 'Updated configs successfully',
            });
        } catch (error) {
            notification.error({
                placement: 'topRight',
                message: 'Failed to update configs',
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="flex flex-col items-center">
            <div className="max-w-[600px] overflow-x-auto bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="min-w-[600px]">
                    <ComponentCard title="Ads Configuration">
                        {isLoadData ? (<div className="min-h-[200px] flex justify-center items-center"><Spin /></div>) : (<>
                            <div>
                                <Label>Ads Propability</Label>
                                <Input
                                    defaultValue={data?.adsConfig.adProbability || 0}
                                    type="number" min="0" max="1"
                                    step={0.1}
                                    onChange={(e) => {
                                        if (data?.adsConfig.adProbability !== Number(e.target.value)) {
                                            setDisable(false);
                                        }
                                        setAdProbability(Number(e.target.value));
                                    }}
                                />
                            </div>
                            <div>
                                <Label>Min time between ads (in seconds)</Label>
                                <Input
                                    defaultValue={data?.adsConfig.minTimeBetweenAds || 0}
                                    type="number" min="0" max="3600" step={1}
                                    onChange={(e) => {
                                        if (data?.adsConfig.minTimeBetweenAds !== Number(e.target.value)) {
                                            setDisable(false);
                                        }
                                        setMinTimeBetweenAds(Number(e.target.value));
                                    }}
                                />
                            </div>
                        </>)}
                    </ComponentCard>
                </div>
            </div>

            <div className="w-[600px] flex justify-end mt-4">
                <Button disabled={disabled} loading={isLoading} size="sm" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}