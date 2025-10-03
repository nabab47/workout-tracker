import { useState, useEffect } from "react";

export default function WorkoutTracker() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(() => {
    return JSON.parse(localStorage.getItem("workoutData")) || {};
  });

  // Save whenever data changes
  useEffect(() => {
    localStorage.setItem("workoutData", JSON.stringify(data));
  }, [data]);

  const dateKey = date.toISOString().split("T")[0];
  const workouts = data[dateKey]?.workouts || [];

  const addWorkout = (name) => {
    setData({
      ...data,
      [dateKey]: {
        workouts: [...workouts, { name, exercises: [] }]
      }
    });
  };

  const addExercise = (workoutIndex, exerciseName) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].exercises.push({ name: exerciseName, sets: [] });
    setData({ ...data, [dateKey]: { workouts: newWorkouts } });
  };

  const addSet = (workoutIndex, exerciseIndex, weight, reps) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].exercises[exerciseIndex].sets.push({ weight, reps });
    setData({ ...data, [dateKey]: { workouts: newWorkouts } });
  };

  return (
    <div className="p-4">
      {/* Date Navigation */}
      <div className="flex justify-between mb-4">
        <button onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}>Prev</button>
        <h2>{dateKey}</h2>
        <button onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}>Next</button>
      </div>

      {/* Workouts */}
      {workouts.map((w, i) => (
        <div key={i} className="border p-2 mb-2 rounded">
          <h3 className="font-bold">{w.name}</h3>

          {w.exercises.map((ex, j) => (
            <div key={j} className="ml-4">
              <h4>{ex.name}</h4>
              {ex.sets.map((s, k) => (
                <p key={k}>Set {k + 1}: {s.weight} lbs x {s.reps} reps</p>
              ))}
              <button
                onClick={() => addSet(i, j, 100, 10)}
                className="text-blue-500"
              >
                + Add Set
              </button>
            </div>
          ))}

          <button
            onClick={() => addExercise(i, "New Exercise")}
            className="text-green-500"
          >
            + Add Exercise
          </button>
        </div>
      ))}

      <button onClick={() => addWorkout("New Workout")} className="text-purple-500">
        + Add Workout
      </button>
    </div>
  );
}
