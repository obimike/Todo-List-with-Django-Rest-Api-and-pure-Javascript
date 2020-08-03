from django.db import models


class Todo(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=500, blank=False)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created']
