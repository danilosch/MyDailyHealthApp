import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  initialize,
  requestPermission,
  readRecords,
  insertRecords,
} from "react-native-health-connect";
import {
  Permission,
  ReadRecordsResult,
} from "react-native-health-connect/lib/typescript/types";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const useHealthConnectData = () => {
  const [androidPermissions, setAndroidPermissions] = useState<Permission[]>(
    []
  );
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [caloriesBurned, setCaloriesBurned] =
    useState<ReadRecordsResult<"TotalCaloriesBurned"> | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const init = async () => {
      // inicializa o client
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.log("Failed to initialize Health Connect");
        return;
      }

      // solicita permissões
      const grantedPermissions = await requestPermission([
        { accessType: "read", recordType: "TotalCaloriesBurned" },
        { accessType: "read", recordType: "Height" },
        { accessType: "read", recordType: "Weight" },
        { accessType: "write", recordType: "TotalCaloriesBurned" },
      ]);

      setAndroidPermissions(grantedPermissions);
    };

    init();
  }, []);

  const getHealthData = async () => {
    const today = new Date();
    const timeRangeFilter: TimeRangeFilter = {
      operator: "after",
      startTime: new Date(today.getTime() - 604800000).toISOString(), // 7 dias
      // endTime: today.toISOString(),
    };

    const height = await readRecords("Height", {
      timeRangeFilter,
      ascendingOrder: false,
    });

    const weight = await readRecords("Weight", {
      timeRangeFilter,
      ascendingOrder: false,
    });

    const result = await readRecords("TotalCaloriesBurned", {
      timeRangeFilter,
      ascendingOrder: false,
    });

    setCaloriesBurned(result);
    setHeight(Math.round(height.records[0].height.inMeters * 100) / 100);
    setWeight(weight.records[0].weight.inKilograms);
  };

  useEffect(() => {
    const hasAndroidPermission = (recordType: string) => {
      return androidPermissions.some((perm) => perm.recordType === recordType);
    };

    if (!hasAndroidPermission("TotalCaloriesBurned")) {
      return;
    }

    getHealthData();
  }, [androidPermissions]);

  const insertActivity = ({
    calories,
    startTime,
  }: {
    calories: number;
    startTime: Date;
  }) => {
    insertRecords([
      {
        recordType: "TotalCaloriesBurned",
        energy: { unit: "kilocalories", value: calories },
        startTime: startTime.toISOString(),
        endTime: new Date(startTime.getTime() + 1800000).toISOString(),
      },
    ]);

    getHealthData();
  };

  return { caloriesBurned, insertActivity, height, weight };
};

export default useHealthConnectData;
