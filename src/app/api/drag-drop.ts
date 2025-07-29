import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { PlayerInfo } from './player-info';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  handleDragDrop(event: CdkDragDrop<PlayerInfo[]>) {
    const fromList = event.previousContainer.data;
    const toList = event.container.data;

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        fromList,
        toList,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(toList, event.previousIndex, event.currentIndex);
    }
  }
}
