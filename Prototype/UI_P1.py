import tkinter as tk
from tkinter import ttk
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from logic import Logic

class FrontendPrototype1:
    def __init__(self, root):
        self.backend = Logic()
        self.root = root
        self.root.title("Nutritional Calculator")
        self.root.configure(bg="SystemButtonFace")
        self.root.resizable(False, False)
        self.setup_ui()

    def reset(self):
        self.backend.reset_data()
        self.meal_list.delete(0, tk.END)
        self.name_input.delete(0, tk.END)
        self.kcal_input.delete(0, tk.END)
        self.age_input.delete(0, tk.END)
        self.body_weight_input.delete(0, tk.END)
        self.gender_var.set('')
        self.update_display()

    def update_display(self):
        self.nutrient_output.config(state=tk.NORMAL)
        self.nutrient_output.delete(1.0, tk.END)
        self.nutrient_output.insert(tk.END, f"Total Calories: {self.backend.total_calories:.1f}\n")
        for _, row in self.backend.nutrient_totals.iterrows():
            self.nutrient_output.insert(tk.END, f"{row['Name']}: {row['Value']:.1f} {row['Unit']}\n")
        self.nutrient_output.config(state=tk.DISABLED)
        self.update_pie_chart()

    def update_pie_chart(self):
        tk_color = self.root.cget("bg")
        rgb_color = self.root.winfo_rgb(tk_color)
        matplotlib_color = "#{:02x}{:02x}{:02x}".format(
            rgb_color[0] // 256, rgb_color[1] // 256, rgb_color[2] // 256
        )
        try:
            maintenance_cal = float(self.kcal_input.get())
            if maintenance_cal <= 0:
                raise ValueError
        except ValueError:
            maintenance_cal = 0
        if maintenance_cal > 0:
            consumed_percentage = min((self.backend.total_calories / maintenance_cal) * 100, 100)
            remaining_percentage = 100 - consumed_percentage
            sizes = [consumed_percentage, remaining_percentage]
            labels = ['Consumed', 'Remaining']
            colors = ['#ff9999', '#66b3ff']
        else:
            sizes = [100]
            labels = ['Consumed']
            colors = ['#ff9999']
        self.fig.clear()
        self.fig.patch.set_facecolor(matplotlib_color)
        ax = self.fig.add_subplot(111)
        ax.set_facecolor(matplotlib_color)
        ax.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
        ax.set_title("Calorie Consumption Breakdown", color="black")
        self.pie_canvas.draw()

    def add_meal(self):
        food = self.food_input.get()
        if not food:
            return
        self.backend.add_meal(food)
        self.meal_list.insert(tk.END, food)
        self.food_input.delete(0, tk.END)
        self.update_display()

    def setup_ui(self):
        input_frame = tk.Frame(self.root, bg=self.root.cget("bg"))
        input_frame.pack(side=tk.LEFT, padx=10, pady=10)
        output_frame = tk.Frame(self.root, bg=self.root.cget("bg"))
        output_frame.pack(side=tk.RIGHT, padx=10, pady=10)
        name_label = tk.Label(input_frame, text='Name', bg=self.root.cget("bg"))
        name_label.pack()
        self.name_input = tk.Entry(input_frame, width=40)
        self.name_input.pack()
        kcal_label = tk.Label(input_frame, text='Maintenance Calories (Kcal)', bg=self.root.cget("bg"))
        kcal_label.pack()
        self.kcal_input = tk.Entry(input_frame, width=40)
        self.kcal_input.pack()
        age_label = tk.Label(input_frame, text='Age', bg=self.root.cget("bg"))
        age_label.pack()
        self.age_input = tk.Entry(input_frame, width=40)
        self.age_input.pack()
        body_weight_label = tk.Label(input_frame, text='Body Weight (Lbs)', bg=self.root.cget("bg"))
        body_weight_label.pack()
        self.body_weight_input = tk.Entry(input_frame, width=40)
        self.body_weight_input.pack()
        gender_label = tk.Label(input_frame, text='Gender', bg=self.root.cget("bg"))
        gender_label.pack()
        self.gender_var = tk.StringVar()
        gender_dropdown = ttk.Combobox(input_frame, textvariable=self.gender_var, values=['Male', 'Female'])
        gender_dropdown.pack()
        food_label = tk.Label(input_frame, text='Ingredient', bg=self.root.cget("bg"))
        food_label.pack()
        self.food_input = tk.Entry(input_frame, width=40)
        self.food_input.pack()
        add_meal_button = tk.Button(input_frame, text='Add Item', command=self.add_meal)
        add_meal_button.pack()
        meal_label = tk.Label(input_frame, text='Catalog of Foods Eaten', bg=self.root.cget("bg"))
        meal_label.pack()
        self.meal_list = tk.Listbox(input_frame, height=15, width=40)
        self.meal_list.pack()
        reset_button = tk.Button(input_frame, text='Reset', command=self.reset)
        reset_button.pack()
        self.nutrient_output = tk.Text(output_frame, width=40, height=20, state=tk.DISABLED, bg=self.root.cget("bg"))
        self.nutrient_output.pack()
        self.fig = Figure(figsize=(4, 4))
        ax = self.fig.add_subplot(111)
        ax.axis('off')
        self.pie_canvas = FigureCanvasTkAgg(self.fig, output_frame)
        self.pie_canvas.get_tk_widget().pack()

def main():
    root = tk.Tk()
    app = FrontendPrototype1(root)
    root.mainloop()

if __name__ == "__main__":
    main()
