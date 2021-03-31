import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storage = new StorageService<ReadingListItem[]>(KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storage.read();
  }

  async addBook(b: Book): Promise<void> {
    this.storage.update(list => {
      const { id, ...rest } = b;
      list.push({
        bookId: id,
        ...rest
      });
      return list;
    });
  }

  async removeBook(id: string): Promise<void> {
    this.storage.update(list => {
      return list.filter(x => x.bookId !== id);
    });
  }

  async markBookAsRead(id: string): Promise<{finishedDate: string}> {
    let ISOUpdateDate = "";
    this.storage.update(list => {
      const temp=[];
      let d,n;
      for(let i=0;i<list.length;i++){
        if(list[i].bookId === id){
          d = new Date();
          n = d.toISOString();
          ISOUpdateDate = n;
          list[i].finished = true;
          list[i].finishedDate = n;
        }
        temp.push(list[i]);
      }
      return temp;
    });
    return { finishedDate: ISOUpdateDate};
  }
}
