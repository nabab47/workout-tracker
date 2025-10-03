import { useState, useEffect } from "react";

export default function WorkoutTracker() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({});
  const [newWorkout, setNewWorkout] = useState("");
  const [exerciseInputs, setExerciseInputs] = useState({});
  const [setInputs, setSetInputs] = useState({});
  
  const dateKey = date.toISOString().split("T")[0];
  const workouts = data[dateKey]?.workouts || [];

  // Load from backend on mount
  useEffect(() => {
    fetch("/api/workouts")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  // Save to backend whenever data changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }
  }, [data]);

  const addWorkout = () => {
    if (!newWorkout.trim()) return;
    setData({
      ...data,
      [dateKey]: {
        workouts: [...workouts, { name: newWorkout, exercises: [] }]
      }
    });
    setNewWorkout("");
  };

  const addExercise = (workoutIndex) => {
    const name = exerciseInputs[workoutIndex];
    if (!name || !name.trim()) return;

    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].exercises.push({ name, sets: [] });

    setData({ ...data, [dateKey]: { workouts: newWorkouts } });
    setExerciseInputs({ ...exerciseInputs, [workoutIndex]: "" });
  };

  const addSet = (workoutIndex, exerciseIndex) => {
    const inputKey = `${workoutIndex}-${exerciseIndex}`;
    const { weight, reps } = setInputs[inputKey] || {};

    if (!weight || !reps) return;

    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].exercises[exerciseIndex].sets.push({
      weight: parseInt(weight, 10),
      reps: parseInt(reps, 10),
    });

    setData({ ...data, [dateKey]: { workouts: newWorkouts } });
    setSetInputs({ ...setInputs, [inputKey]: { weight: "", reps: "" } });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Date Navigation */}
      <div className="flex justify-between mb-4">
        <button onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}>Prev</button>
        <h2 className="font-bold">{dateKey}</h2>
        <button onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}>Next</button>
      </div>

      {/* Workouts */}
      {workouts.map((w, i) => (
        <div key={i} className="border p-2 mb-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">{w.name}</h3>

          {w.exercises.map((ex, j) => (
            <div key={j} className="ml-4 mb-2 p-2 border rounded bg-white">
              <h4 className="font-semibold">{ex.name}</h4>
              {ex.sets.map((s, k) => (
                <p key={k} className="text-sm">
                  Set {k + 1}: {s.weight} lbs × {s.reps} reps
                </p>
              ))}

              {/* Add Set Form */}
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  placeholder="Weight"
                  className="border p-1 rounded w-20"
                  value={setInputs[`${i}-${j}`]?.weight || ""}
                  onChange={(e) =>
                    setSetInputs({
                      ...setInputs,
                      [`${i}-${j}`]: {
                        ...setInputs[`${i}-${j}`],
                        weight: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Reps"
                  className="border p-1 rounded w-20"
                  value={setInputs[`${i}-${j}`]?.reps || ""}
                  onChange={(e) =>
                    setSetInputs({
                      ...setInputs,
                      [`${i}-${j}`]: {
                        ...setInputs[`${i}-${j}`],
                        reps: e.target.value,
                      },
                    })
                  }
                />
                <button
                  onClick={() => addSet(i, j)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Add Set
                </button>
              </div>
            </div>
          ))}

          {/* Add Exercise Form */}
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Exercise name"
              className="border p-1 flex-1 rounded"
              value={exerciseInputs[i] || ""}
              onChange={(e) =>
                setExerciseInputs({ ...exerciseInputs, [i]: e.target.value })
              }
            />
            <button
              onClick={() => addExercise(i)}
              className="bg-green-500 text-white px-2 rounded"
            >
              Add Exercise
            </button>
          </div>
        </div>
      ))}

      {/* Add Workout Form */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Workout name"
          className="border p-1 flex-1 rounded"
          value={newWorkout}
          onChange={(e) => setNewWorkout(e.target.value)}
        />
        <button
          onClick={addWorkout}
          className="bg-purple-500 text-white px-2 rounded"
        >
          Add Workout
        </button>
      </div>
    </div>
  );
}
