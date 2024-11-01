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
} from "react-native-health-connect/lib/typescript/types";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const useHealthConnectData = () => {
  const [androidPermissions, setAndroidPermissions] = useState<Permission[]>(
    []
  );
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const init = async () => {
      // initialize the client
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.log("Failed to initialize Health Connect");
        return;
      }

      // request permissions
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

  useEffect(() => {
    const hasAndroidPermission = (recordType: string) => {
      return androidPermissions.some((perm) => perm.recordType === recordType);
    };

    if (!hasAndroidPermission("TotalCaloriesBurned")) {
      return;
    }

    const getHealthData = async () => {
      const today = new Date();
      const timeRangeFilter: TimeRangeFilter = {
        operator: "after",
        startTime: new Date(today.getTime() - 604800000).toISOString(),
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

      // insertRecords([
      //   {
      //     recordType: "TotalCaloriesBurned",
      //     energy: { unit: "kilocalories", value: 1500 },
      //     startTime: new Date(today.getTime() - 1800000).toISOString(),
      //     endTime: today.toISOString(),
      //   },
      // ]);

      const totalCaloriesBurned = await readRecords("TotalCaloriesBurned", {
        timeRangeFilter,
        ascendingOrder: false,
      });

      totalCaloriesBurned.records.map((item) =>
        console.log("totalCaloriesBurned", [
          item.startTime,
          item.endTime,
          item.energy.inKilocalories,
        ])
      );

      // console.log("height", height.records[0].height.inMeters);
      // console.log("weight", weight.records[0].weight.inKilograms);

      setHeight(Math.round(height.records[0].height.inMeters * 100) / 100);
      setWeight(weight.records[0].weight.inKilograms);
    };

    getHealthData();
  }, [androidPermissions]);

  return { androidPermissions, height, weight };
};

export default useHealthConnectData;
