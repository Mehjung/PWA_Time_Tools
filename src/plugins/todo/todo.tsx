"use client";

import { type FC, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, ListTodo, Plus } from "lucide-react";
import { TodoForm } from "./todo-form";
import { useTodoStore, type TodoItem } from "./todo-store";
import { PluginProps } from "@/components/hoc/with-plugin-ref";

// Exportiere die Funktion für den initialen Check
export const onPluginPreMount = () => {
  console.log("DEBUG: Todo checkInitialRunning called");
  const hasActive = useTodoStore.getState().hasActiveTodos();
  console.log("DEBUG: Todo initial running state:", hasActive);
  return hasActive;
};

export const Todo: FC<PluginProps> = ({ running }) => {
  const { todos, addTodo, toggleTodo, removeTodo, hasActiveTodos } =
    useTodoStore();
  const [, setRunning] = running;

  // Aktualisiere Running-Status wenn sich Todos ändern
  useEffect(() => {
    console.log("DEBUG: Todo useEffect running state update", {
      hasActive: hasActiveTodos(),
      todosCount: todos.length,
    });

    // Nur den Running-Status ändern, wenn er sich wirklich geändert hat
    const isRunning = hasActiveTodos();
    setRunning(isRunning);
  }, [todos, setRunning, hasActiveTodos]);

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ListTodo className="h-5 w-5" aria-hidden="true" />
          Aufgabenliste
          {todos.some((todo) => !todo.completed) && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Aktiv
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TodoForm onSubmit={addTodo} />

          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <div className="space-y-6">
              {activeTodos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Aktive Aufgaben
                  </h3>
                  <div className="space-y-2">
                    {activeTodos.map((todo: TodoItem) => (
                      <Card
                        key={todo.id}
                        className="overflow-hidden hover:shadow-md transition-all group border bg-accent/5 hover:bg-accent/10"
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full bg-background text-foreground border border-border/50 group-hover:border-primary/30 transition-colors"
                            onClick={() => toggleTodo(todo.id)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">
                              Aufgabe als erledigt markieren
                            </span>
                          </Button>
                          <span className="flex-1 min-w-0">
                            <span className="block truncate text-base">
                              {todo.text}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              Erstellt am{" "}
                              {new Date(todo.createdAt).toLocaleDateString(
                                "de-DE",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive/90"
                            onClick={() => removeTodo(todo.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Aufgabe löschen</span>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Erledigte Aufgaben
                  </h3>
                  <div className="space-y-2">
                    {completedTodos.map((todo: TodoItem) => (
                      <Card
                        key={todo.id}
                        className="overflow-hidden hover:shadow-md transition-all group border bg-muted/30 hover:bg-muted/50"
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full bg-background text-foreground/50 border border-border/30 group-hover:border-primary/20 transition-colors"
                            onClick={() => toggleTodo(todo.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">
                              Aufgabe als unerledigt markieren
                            </span>
                          </Button>
                          <span className="flex-1 min-w-0">
                            <span className="block truncate text-base line-through text-muted-foreground">
                              {todo.text}
                            </span>
                            <span className="block text-xs text-muted-foreground/70">
                              Erstellt am{" "}
                              {new Date(todo.createdAt).toLocaleDateString(
                                "de-DE",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive/70 hover:text-destructive/90"
                            onClick={() => removeTodo(todo.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Aufgabe löschen</span>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTodos.length === 0 && completedTodos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Keine Aufgaben vorhanden
                  </p>
                  <p className="text-sm">
                    Fügen Sie eine neue Aufgabe hinzu, um loszulegen.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
