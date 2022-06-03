import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Post } from './shared/interfaces/Post';
import { PostService } from './shared/services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'backend-demo';
  posts: Post[] = [];
  constructor(private postService: PostService) {}
  ngOnInit(): void {

    this.postService.initPost().subscribe(
      (data: any) => {
        console.log("data initialized")
      }
    )
    this.postService.getAll().subscribe((data: Post[]) => {
      this.posts = data;
      console.log(this.posts);
    }),
      () => {
        console.log('error occured');
      },
      () => {
        console.log('complete!');
      };
  }

  deletePost(id: number) {
    this.postService.delete(id).subscribe((res) => {
      this.posts = this.posts.filter((item) => item.id !== id);
      console.log('Post deleted successfully!');
    });
  }
}
