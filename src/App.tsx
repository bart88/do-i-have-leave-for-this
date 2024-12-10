import "./App.css";
import LeaveWidget from "./components/LeaveWidget";

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 gap-3 pt-8">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] hidden md:block">
        Do I have leave for this?
      </h1>
      <p>Workout how much leave you will have on a future date</p>
      <LeaveWidget />
    </div>
  );
}

export default App;
