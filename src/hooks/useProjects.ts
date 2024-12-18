import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase.from('projects').select('*');
                if (error) {
                    throw error;
                }
                setProjects(data || []);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLoading(false);
            }
        };

        fetchProjects();

        // Optional: Set up real-time subscription
        const subscription = supabase
            .channel('projects')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'projects'
            }, (payload) => {
                switch (payload.eventType) {
                    case 'INSERT':
                        setProjects((prev) => [...prev, payload.new]);
                        break;
                    case 'UPDATE':
                        setProjects((prev) => prev.map((project) => 
                            project.id === payload.new.id ? payload.new : project
                        ));
                        break;
                    case 'DELETE':
                        setProjects((prev) => prev.filter((project) => 
                            project.id !== payload.old.id
                        ));
                        break;
                }
            })
            .subscribe();

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        projects,
        loading,
        error
    };
}